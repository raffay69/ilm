"use client"

import { Zap, Clock } from "lucide-react"
import { createTheme, LinearProgress, ThemeProvider } from "@mui/material"
import { LoaderFive } from "./loader"

interface VideoLoaderProps {
  quality: "low" | "high"
  topic: string
}

export default function VideoLoader({ quality, topic  }: VideoLoaderProps) {
  const theme = createTheme({
      palette: {
        primary : {
          main : "#9F8C76"
        }
      },
    });

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="text-center py-12">
        {/* Animated Video Icon */}
        <h3 className="text-2xl font-bold text-primary-800 mb-2">
          Creating Your {quality === "high" ? "HD (1080p)" : "Standard (480p)"} Video
        </h3>
        <p className="text-primary-600 mb-8">
          Generating visual content for: <span className="font-medium">"{topic}"</span>
        </p>
        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-primary-600 mb-2">
            <LoaderFive text="Generating your video..." />
          </div>
          <ThemeProvider theme={theme}>
              <LinearProgress color="primary" style={{height: '10px' , borderRadius:'10px'}}/>
          </ThemeProvider>
        </div>

        {/* Quality Badge */}
        <div className="mt-6">
          <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              quality === "high" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
            }`}
          >
            {quality === "high" ? (
              <>
                <Clock className="w-4 h-4 mr-2" />
                High Quality (1080p)
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Standard Quality (480p)
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
