from manim import *

def play_intro(scene):
    # Configure the camera for a black background
    scene.camera.background_color = BLACK
    
    # Add audio file
    scene.add_sound("logo.mp3")
    
    # Font configurations
    logo_font = "Amiri"
    ilm_color = "#6F4E37" 
    tagline_color = '#ECB176'
    urdu_font = "Noto Nastaliq Urdu"

    # Create the Urdu text "علم" (ilm)
    urdu_text = Text(
        "علم",
        font=urdu_font,
        font_size=192,
        color="#A67B5B"
    )

    # Create the English text "ilm"
    english_text = Text(
        "ilm",
        font=logo_font,
        font_size=144,
        color=ilm_color,
        weight=NORMAL
    )

    # Create the tagline
    tagline = Text(
        "Knowledge, Visualized",
        font="Brush Script MT",
        font_size=48,
        color=tagline_color
    )

    # Animation Sequence
    scene.play(Write(urdu_text), run_time=1.0)
    scene.wait(0.3)

    scene.play(ReplacementTransform(urdu_text, english_text), run_time=1.0)
    scene.wait(0.2)

    logo_group = VGroup(english_text, tagline)
    logo_group.arrange(DOWN, buff=0.5)

    scene.play(
        english_text.animate.move_to(logo_group[0].get_center()),
        FadeIn(tagline, shift=UP*0.5),
        run_time=0.8
    )

    scene.wait(0.7)
    
    # Fade out everything
    final_group = VGroup(english_text, tagline)
    scene.play(FadeOut(final_group), run_time=0.3)