"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Send, BookOpen, Video, Sparkles, Zap, Clock  , MenuIcon } from "lucide-react"
import VideoLoader from "@/components/video-loader"
import { createTheme, LinearProgress, ThemeProvider } from '@mui/material';
import axios from 'axios'
import { LoaderFive, LoaderOne } from "@/components/loader"
import { toast } from "sonner"
import { Navbar, NavbarButton, NavbarLogo, NavBody, NavItems } from "@/components/navbar"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton  , useAuth} from "@clerk/nextjs"
import { ClaudeSidebar } from "@/components/newSidebar"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import FadeIn from "@/components/fadeIn"


type VideoQuality = "low" | "high"
type GenerationState = "idle" | "generating-text" | "generating-video" | "complete"

export default function AppPage() {
  const [prompt, setPrompt] = useState("")
  const [videoQuality, setVideoQuality] = useState<VideoQuality>("low")
  const [generationState, setGenerationState] = useState<GenerationState>("idle")
  const [results, setResults] = useState<{
    explanation: string
    quality: VideoQuality
  } | null>(null)
  const [videoUrl , setVideoUrl] = useState<String|null>("")
  const {isSignedIn , isLoaded , getToken } = useAuth()
  const [isSideBarOpen , setIsSideBarOpen] = useState(false)
  const [open , setOpen] = useState(false)


   useEffect(() => {
      if (typeof window !== "undefined") {
        const shown = localStorage.getItem("welcome-shown");
        if (!shown && isSignedIn) {
          setOpen(true);
          localStorage.setItem("welcome-shown", "true");
        }
      }
    }, [isSignedIn]);


  // async function testing() {
  //   const token = await getToken()
  //   const content = 'hello from atlas'
  //   const quality = 'high'
  //   const videoURL = 'nigga'
  //   const fileName = 'sup from atlas'

  //   await axios.post('https://ilm-0xfm.onrender.com/db/save' , {
  //     content : content,
  //     quality : quality,
  //     videoURL : videoURL,
  //     fileName : fileName
  //   },{
  //     headers: {
  //       Authorization : `Bearer ${token}`
  //     }
  //   })
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    let content = null
    let fileName = null
    let videoURL = null;
    e.preventDefault()

    if(!isSignedIn && isLoaded){
      toast.info("Please login first")
      return
    } 

    if (!prompt.trim()) return

    try{
    setGenerationState("generating-text")
    setResults(null)
    setVideoUrl(null)

    //content generation api call
    const res1 = await axios.post('http://localhost:4000/generate',{userPrompt : prompt} , {
      headers : {
        Authorization : `Bearer ${await getToken()}`
      }
    })
    content = res1.data.content
    fileName = res1.data.fileName
    setResults({
          explanation:res1.data.content ,
          quality: videoQuality,
        })
    setGenerationState("generating-video")
    //video generation api call
   const res2 = await axios.post('http://localhost:4000/render' , {filename: res1.data.fileName , manimCode : res1.data.manimCode , quality : videoQuality} , {
    headers : {
      Authorization : `Bearer ${await  getToken()}`
    }
   })
    videoURL = res2.data.videoURL
    setVideoUrl(res2.data.videoURL)  
    setGenerationState("complete")

    }catch(e:any){
      console.log(e.message)
      toast.error("Something went wrong while generating content. Please try again.")
      setGenerationState("idle")
      setVideoUrl(null)
      setResults(null)
      return
    }
    //make a call to the db
    if(content && videoQuality && videoURL && fileName){
      try{
      const res = await axios.post('http://localhost:4000/db/save' , {
        content : content , 
        quality : videoQuality,
        videoURL : videoURL,
        fileName: fileName
      } , {
        headers : {
          Authorization : `Bearer ${await getToken()}`
        }
      })
    }catch(e:any){
      toast.error("failed to save in Recents")
    }
    }
  }

  const resetForm = () => {
    setGenerationState("idle")
    setVideoUrl(null)
    setResults(null)
    setPrompt("")
  }
  const theme = createTheme({
    palette: {
      primary : {
        main : "#9F8C76"
      }
    },
  });

  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Studio",
      link: "/app",
    },
  ];
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        // Open sidebar when mouse is within 20px of the left edge
        if (e.clientX <= 45 && !isSideBarOpen) {
          setIsSideBarOpen(true)
        }
        // Close sidebar when mouse is far from the sidebar (when sidebar is open)
        if (e.clientX > 300 && isSideBarOpen) {
          setIsSideBarOpen(false)
        }
      }
      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [isSideBarOpen])

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-primary-100 to-secondary-100">
      <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <DialogTitle className="text-2xl font-bold">Thanks for Signing In!</DialogTitle>
      <div className="space-y-2">
        <p className="text-lg font-arabic text-black">
        Designed and developed by <a href="https://www.linkedin.com/in/mohammad-abdul-raffay-28a608308/" target="_blank" rel="noopener noreferrer" className="text-secondary-900 underline"
            >Mohammed Abdul Raffay</a> —
          glad to have you here!
        </p>
        <p className="text-md font-arabic">
          If you like what you see, show some ❤️ and 
          <a
            href="https://github.com/raffay69/ilm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary-900 ml-1 underline"
          >
            star my GitHub repo
          </a>
        </p>
      </div>
    </DialogContent>
  </Dialog>
      {/* <button onClick={testing}>click me</button> */}
    {isSignedIn && <MenuIcon size={40} className="absolute left-3 top-[28px]" color="#715a44" />}
    {isSignedIn && <ClaudeSidebar isOpen={isSideBarOpen} setIsOpen={setIsSideBarOpen} color='beige' setResults={setResults} setVideoURL={setVideoUrl} setGenerationState={setGenerationState} />}
      <Navbar >
              <NavBody>
                <NavbarLogo />
                <NavItems items={navItems} />
                <div className="flex items-center gap-4">
                {isLoaded ?
                <>
                <SignedOut>
                  <NavbarButton variant="custom" ><SignInButton /></NavbarButton>
                  <NavbarButton variant="custom" ><SignUpButton /></NavbarButton>
                </SignedOut >
                <SignedIn>
                    <UserButton />
                  </SignedIn>
                  </>
                  : <span className="py-2"><LoaderOne /></span>
                  }
                </div>
              </NavBody>
              </Navbar>
      
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundSize: "60px 60px",
          backgroundRepeat: "repeat",
        }}
      ></div>
      <FadeIn>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-36">
        {/* Header - Only show when idle */}
        {generationState === "idle" && (
          <div className="text-center mb-12 relative">
            <div className="relative">
              <h1 className="text-4xl lg:text-5xl font-bold text-primary-800 font-arabic mb-2">ilm</h1>
              <p className="text-primary-600 mb-6">Knowledge, Visualized</p>
              <h2 className="text-2xl lg:text-3xl font-bold text-primary-900 mb-4">
                What would you like to <span className="text-primary-600">learn </span>today?
              </h2>
              <p className="text-lg text-primary-600 max-w-2xl mx-auto">
                Enter any educational topic and receive both a detailed explanation and visual content to enhance your
                understanding.
              </p>
            </div>
          </div>
        )}

        {/* Input Form - Only show when idle */}
        {generationState === "idle" && (
          <div className="card max-w-4xl mx-auto mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-primary-700 mb-2">
                  Educational Topic or Question
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Explain photosynthesis, How to use useEffect Hook in React, Explain the two-sum problem..."
                  className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  rows={4}
                />
              </div>

              {/* Video Quality Selection */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-3">Video Quality</label>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setVideoQuality("low")}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      videoQuality === "low"
                        ? "border-green-500 bg-green-50"
                        : "border-primary-200 hover:border-primary-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-primary-800">Standard Quality</h3>
                        <p className="text-sm text-primary-600">480p Resolution</p>
                      </div>
                    </div>
                    <ul className="text-sm text-primary-700 space-y-1">
                      <li>• Fast processing (30-60 seconds)</li>
                      <li>• 480p video resolution</li>
                    </ul>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoQuality("high")}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      videoQuality === "high"
                        ? "border-purple-500 bg-purple-50"
                        : "border-primary-200 hover:border-primary-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-primary-800">High Quality</h3>
                        <p className="text-sm text-primary-600">1080p Resolution</p>
                      </div>
                    </div>
                    <ul className="text-sm text-primary-700 space-y-1">
                      <li>• Detailed processing (2-5 minutes)</li>
                      <li>• 1080p HD video resolution</li>
                    </ul>
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="mr-2 w-5 h-5" />
                  Generate Learning Content
                </button>
              </div>
            </form>
          </div>
        )}
          
        {/* Text Generation Loading */}
        {generationState === "generating-text" && (
          <div className="card max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-primary-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-primary-800 mb-2"><LoaderFive text="Analyzing your topic" /></h3>
              <p className="text-primary-600 mb-6">
                Our AI is processing "{prompt}" and generating a comprehensive explanation...
              </p>
              <div className="max-w-md mx-auto h-4">
              <ThemeProvider theme={theme}>
              <LinearProgress color="primary" style={{height: '10px' , borderRadius:'10px'}}/>
              </ThemeProvider>
              </div>
            </div>
          </div>
        )}

        {/* Text Explanation - Show when text is ready */}
        {results && results.explanation && (
          <div className="card mb-8 mt-[-20px]">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-primary-800">Detailed Explanation</h3>
              {generationState === "generating-video" && (
                <div className="ml-auto">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Complete
                  </span>
                </div>
              )}
            </div>
            <div className="prose prose-primary max-w-none">
            <div
            className="text-primary-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: results.explanation }}
          ></div>
            </div>
          </div>
        )}

        {/* Video Generation Loading */}
        {generationState === "generating-video" && (
          <VideoLoader quality={videoQuality} topic={prompt} />
        )}

        {/* Video Player - Show when video is ready */}
        {generationState === "complete" && videoUrl && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-800">Visual Learning Content</h3>
                  <p className="text-sm text-primary-600">
                    Resolution: {results?.quality === "high" ? "1080p HD" : "480p Standard"} • Auto-playing now
                  </p>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">✓ Ready</span>
            </div>

            <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl max-w-5xl mx-auto focus:outline-none" tabIndex={0}>
            <video
              src={videoUrl as string}
              className="w-full h-auto min-h-[400px] lg:min-h-[500px]"
              autoPlay
              controls
            />
            </div>
          </div>
        )}

        {/* Action Buttons - Show when complete */}
        {generationState === "complete" && (
          <div className="flex justify-center">
            <button onClick={resetForm} className="btn-secondary">
              Ask Another Question
            </button>
          </div>
        )}
      </div>
      </FadeIn>
    </div>
  )
}
