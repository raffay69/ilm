import os
import asyncio
import tempfile
from typing import Optional
import edge_tts
from manim_voiceover.services.base import SpeechService


class EdgeTTSService(SpeechService):
    """Simple Edge TTS service for manim-voiceover"""
    
    def __init__(self, voice: str = "en-US-JennyNeural", **kwargs):
        self.voice = voice
        super().__init__(**kwargs)
    
    def generate_from_text(self, text: str, cache_dir: Optional[str] = None, path: Optional[str] = None, **kwargs) -> dict:
        # Ensure cache_dir exists
        if cache_dir is None:
            cache_dir = "media/voiceovers"
        
        # Create cache directory if it doesn't exist
        os.makedirs(cache_dir, exist_ok=True)
        
        if path is None:
            # Create file in the cache directory
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3', dir=cache_dir)
            audio_path = temp_file.name
            temp_file.close()
        else:
            audio_path = path
        
        asyncio.run(self._create_speech_file(text, audio_path))
        
        # Get the filename without path for manim-voiceover
        audio_filename = os.path.basename(audio_path)
        
        return {
            "input_text": text,  # Required by VoiceoverTracker
            "original_audio": audio_filename,
            "final_audio": audio_filename,
            "word_boundaries": []
        }
    
    async def _create_speech_file(self, text: str, filepath: str):
        communicate = edge_tts.Communicate(text, self.voice)
        await communicate.save(filepath)