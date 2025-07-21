import express from 'express'
import {exec} from 'child_process'
import util from 'util'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve }  from 'path'
import cors from 'cors'
import {v2 as cloudinary} from 'cloudinary'
import { GoogleGenAI, Type } from "@google/genai";
import 'dotenv/config'
import { authMiddleware } from './middleware.mjs'
import { dataModel } from './database.mjs'


const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });



const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const execPromisified = util.promisify(exec)

const app = express()
app.use(express.json())
app.use(cors())

app.listen(4000,()=>{
    console.log("running on 4000")
})
  


app.post('/db/save' , authMiddleware , async (req,res)=>{
  const { content , quality  , videoURL , fileName } = req.body
  const userID = req.userID
  try{
  await dataModel.create({
    userID : userID,
    fileName : fileName,
    content : content,
    videoURL : videoURL,
    quality : quality
  })
  res.status(200).json({message : "saved in DB"})
  }catch(e){
    res.status(500).json({message : e.message})
  }
})  

app.get('/db/recents' , authMiddleware , async (req, res)=>{
  const userID = req.userID
  const data = await dataModel.find({userID : userID}).sort({createdAt: -1})
  res.json(data)
})


app.put('/db/remove' , authMiddleware , async (req,res)=>{
  const {fileName} = req.body
  const userID = req.userID
  try{
  await dataModel.deleteOne({userID : userID , fileName : fileName})
  res.status(200).json({message : "deleted succesfully"})
  }catch(e){
    res.status(500).json({message : `error deleting -> ${e.message}`})
    console.log(e.message)
  }
})


// gemini endpoint 
app.post('/generate' , authMiddleware ,  async (req, res)=>{
    const {userPrompt} = req.body
    try{
    const data = await generateCode(userPrompt)
    res.json(data)
    }
    catch(e){
        console.log(e.message)
        res.status(500).json({ error: `Error generating content : ${e.message} ` })   
     }
})


app.post('/render',authMiddleware ,  async (req, res) => {
    try {
        const { filename , manimCode , quality } = req.body 
        const out = await execPromisified(`touch ${filename}.py`)
        const filepath = resolve(__dirname , `${filename}.py`)
        fs.writeFileSync(filepath , manimCode)
        try{
        const {stdout , stderr} = await execPromisified(`python -m manim ${filename}.py -q${quality==='low'?"l":"h"} --output_file ./${filename}.mp4`)
        console.log(stdout)
        console.log(stderr) 
         }catch(e){
          console.log(`build failed ${e.message}`)
          await execPromisified(`rm ${filename}.py`)
          console.log(`deleted ${filename}.py`)
          await execPromisified(`rm -rf ./media/videos/${filename}`)
          console.log(`deleted ./media/videos/${filename}`)
        }
        const videopath = `./media/videos/${filename}/${quality==="low"?"480p15":"1080p60"}/${filename}.mp4`
        const videoURL = await uploadToCloud(videopath)
        await execPromisified(`rm ${filename}.py`)
        console.log(`deleted ${filename}.py`)
        await execPromisified(`rm -rf ./media/videos/${filename}`)
        console.log(`deleted ./media/videos/${filename}`)
        res.json({ videoURL: videoURL  })
    } catch (error) {
        console.error("Render failed:", error)
        res.status(500).json({ error: "Video rendering failed", details: error.message })
    }
})


async function uploadToCloud(filepath){
    try {
        const result = await cloudinary.uploader.upload(filepath, {
          resource_type: 'video',
          folder: 'videos', 
          use_filename: true,
          unique_filename: false,
        });
        console.log('Upload successful:', result.secure_url);
        return result.secure_url;
      } catch (error) {
        console.error('Upload failed:', error);
      }
}

async function generateCode(userPrompt) {
    const manimPrompt = `
You are an expert in the Manim animation library.  
Generate a clean, error-free Manim script that visually explains any **educational concept** (not just algorithms) using a concrete example.

📦 OUTPUT FORMAT (Strict JSON):
{
  "content": "Detailed explanation of the topic or problem",
  "fileName": "suggested_filename_without_extension",
  "manimCode": "Complete Manim script with voice-over"
}

The "content" field in the output JSON must be a detailed and well-formatted explanation of the concept. It should include:
- A descriptive introduction and context
- Clear section headers using <h2> or <h3> tags
- Key terms or important phrases in <b>bold</b>
- Lists or steps using <ul><li>...</li></ul>
- Math formulas (if needed) written cleanly, using LaTeX or plain HTML
- No shallow summaries — aim for at least 200-300 words of insightful explanation
-If the topic involves code, include short code snippets in <pre><code>...</code></pre> tags inside the explanation.

🛠️ MANDATORY SETUP:
Use this structure:
from manim import *
from manim_voiceover import VoiceoverScene
from edge_tts_class import EdgeTTSService
from intro import play_intro

class [TopicName](VoiceoverScene):
    def construct(self):
        self.set_speech_service(EdgeTTSService(voice="en-US-JennyNeural"))
        play_intro(self)
        # Your animation here

✅ REQUIRED RULES:
- All animation steps must use self.play(...)
- All pauses must use self.wait(...)
- Use self.voiceover(text="...") as tracker for syncing
- All objects must be defined before they are referenced
- Use only proper method names: Create(), FadeIn(), Transform(), etc.
- Use .to_edge(), .next_to(), .shift(), and .scale() for layout

⚠️ STRICT RULE — DO NOT USE FRAME_WIDTH or FRAME_HEIGHT
- These are NOT defined in Manim and will cause a NameError
- Replace with fixed values like width=6 or use .to_edge(), .shift(), .move_to(ORIGIN)
- Valid constants are: ORIGIN, UP, DOWN, LEFT, RIGHT

🎨 COLOR USAGE RULE (STRICT):
You may ONLY use the following predefined color constants in Manim:

WHITE, GRAY_A, GREY_A, GRAY_B, GREY_B, GRAY_C, GREY_C, GRAY_D, GREY_D, GRAY_E, GREY_E, BLACK,
LIGHTER_GRAY, LIGHTER_GREY, LIGHT_GRAY, LIGHT_GREY, GRAY, GREY, DARK_GRAY, DARK_GREY, DARKER_GRAY, DARKER_GREY,
BLUE_A, BLUE_B, BLUE_C, BLUE_D, BLUE_E, PURE_BLUE, BLUE, DARK_BLUE,
TEAL_A, TEAL_B, TEAL_C, TEAL_D, TEAL_E, TEAL,
GREEN_A, GREEN_B, GREEN_C, GREEN_D, GREEN_E, PURE_GREEN, GREEN,
YELLOW_A, YELLOW_B, YELLOW_C, YELLOW_D, YELLOW_E, YELLOW,
GOLD_A, GOLD_B, GOLD_C, GOLD_D, GOLD_E, GOLD,
RED_A, RED_B, RED_C, RED_D, RED_E, PURE_RED, RED,
MAROON_A, MAROON_B, MAROON_C, MAROON_D, MAROON_E, MAROON,
PURPLE_A, PURPLE_B, PURPLE_C, PURPLE_D, PURPLE_E, PURPLE,
PINK, LIGHT_PINK, ORANGE, LIGHT_BROWN, DARK_BROWN, GRAY_BROWN, GREY_BROWN

❌ Do NOT use custom hex colors (e.g., "#FF0000") or undefined color names (e.g., "skyblue", "lightgreen").
❌ Only use these exact constant names — otherwise the script will break.


🔐 CODE CLASS RULES (STRICT!):
You may ONLY use the following constructor:

Code(
  code_string: str,
  language: str | None = None,
  formatter_style: str = "vim",
  tab_width: int = 4,
  add_line_numbers: bool = True,
  line_numbers_from: int = 1,
  background: Literal["rectangle", "window"] = "rectangle",
  background_config: dict | None = None,
  paragraph_config: dict | None = None
)

❌ DO NOT use: code=, font_size=, code_file=
❌ DO NOT index into Code objects (e.g. .code[0], [1], etc.)

🚫 ABSOLUTE RULE — CODE HIGHLIGHTING:
DO NOT highlight individual lines of a Code object.
- Code objects do NOT expose internal line elements.
- NEVER use .code[0], code_block[4], etc.

✅ To highlight code:
    SurroundingRectangle(code_block, color=YELLOW)

❗If you absolutely must highlight specific lines:
- You must use separate Text(...) objects, manually arranged in VGroup(...).arrange(DOWN)

⛔ Repeat: NEVER use code_block.code[3] or code_block[2] — this will BREAK.

🧠 VISUAL ELEMENTS GUIDELINES:
- Use VGroup + .arrange(RIGHT) for arrays
- Use MathTex() for equations
- Use Text() or MarkupText() for labels
- DO NOT USE Code() to render simple text , use Text() for that strictly
- Use SurroundingRectangle only on valid VMobjects
- Use Group(...) when combining VMobjects with other types
- ✅ Only use valid shape classes that exist in Manim (e.g., Circle, Square, Line, Polygon, Arrow, etc.)
- ❌ Do NOT invent or assume non-existent shapes like Cloud, Star, Tree, unless they are user-defined in the code
- 🔒 Keep all animations **simple and stable** to minimize the chance of runtime errors (e.g., no overly fancy particle effects, no custom object paths, no transformations on non-existent elements)

---

🎯 STRICT INSTRUCTION:
Follow the example structure below **exactly**.
Use only safe patterns. Do not introduce unverified syntax. Do not skip 'self.wait()' or 'self.play()'.

---

📘 REFERENCE EXAMPLE:

from manim import *
from manim_voiceover import VoiceoverScene
from edge_tts_class import EdgeTTSService
from intro import play_intro

class FullConceptExample(VoiceoverScene):
    def construct(self):
        self.set_speech_service(EdgeTTSService(voice="en-US-JennyNeural"))
        play_intro(self)

        heading = Text("Understanding Arrays", color=BLUE).scale(0.8)
        heading.to_edge(UP)

        array_values = [3, 7, 1, 9, 2]
        boxes = VGroup()
        for val in array_values:
            r = Rectangle(height=1, width=1)
            t = Text(str(val)).scale(0.5).move_to(r.get_center())
            boxes.add(VGroup(r, t))
        boxes.arrange(RIGHT, buff=0.2).next_to(heading, DOWN, buff=1)

        self.play(FadeIn(heading))
        with self.voiceover(text="Here is an array of numbers.") as tracker:
            self.play(FadeIn(boxes), run_time=tracker.duration)
        self.wait(0.5)

        highlight = SurroundingRectangle(boxes[2], color=YELLOW)
        with self.voiceover(text="We highlight the third element.") as tracker:
            self.play(Create(highlight), run_time=tracker.duration)
        self.play(FadeOut(highlight))

        equation = MathTex("a^2 + 2ab + b^2 = (a + b)^2").scale(0.8)
        equation.next_to(boxes, DOWN, buff=1)
        with self.voiceover(text="A well-known identity in algebra.") as tracker:
            self.play(Write(equation), run_time=tracker.duration)

        code_block = Code(
            code_string="console.log(sum(2, 3));",
            language="javascript",
            background="window",
            tab_width=2
        )
        code_block.scale(0.6).next_to(equation, DOWN, buff=1)
        with self.voiceover(text="Heres a JavaScript snippet.") as tracker:
            self.play(FadeIn(code_block), run_time=tracker.duration)

        highlight_code = SurroundingRectangle(code_block, color=GREEN, buff=0.1)
        self.play(Create(highlight_code))
        self.wait(1)

        with self.voiceover(text="Thank you for watching!"):
            self.play(FadeOut(Group(heading, boxes, equation, code_block, highlight_code)))

        self.wait()

---

IMPORTANT!!! — Make sure that:
- ❌ Text elements NEVER overlap each other 
- ❌ DO NOT USE ANY "SVG" !! They are not available and will throw Error !! DO NOT USE THEM 
- ❌ Do NOT use modules like 'random', 'numpy', 'np', or 'math'. If you absolutely MUST use them, you MUST include the proper import statements (e.g., 'import random', 'import numpy as np') at the top of the code. Otherwise, it will break with a NameError.
- ✅ Old text is ALWAYS faded out before showing new text (use self.play(FadeOut(...)))
- ✅ Text is ALWAYS within the screen bounds and does NOT go off-screen
- ✅ Use VGroup(...).arrange(...) with proper buff spacing to layout multiple text objects
- ✅ Use .scale(), .next_to(), and .shift() to fit content nicely and avoid visual clutter
- ❌ Do NOT use .to_center() — it does NOT exist in Manim. Use .move_to(ORIGIN) instead
- ❌ NEVER use FRAME_WIDTH or FRAME_HEIGHT — these are NOT predefined constants and will cause NameError
- ✅ Use explicit numbers for width/height (e.g., width=6) or use layout helpers like .to_edge(), .move_to(ORIGIN)
- ✅ Constants like ORIGIN, UP, DOWN, LEFT, RIGHT are safe and encouraged

🧠 NOW GENERATE:
Generate the explanation and the code based on the following user prompt:  ${userPrompt}
`
        const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: manimPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },          
              fileName: { type: Type.STRING },
              manimCode: { type: Type.STRING }
            },
            required: ["content", "fileName", "manimCode"] 
          },
        thinkingConfig: {
          thinkingBudget: 0
        }
      }
    });
    console.log(response.text)
    return JSON.parse(response.text);
  }