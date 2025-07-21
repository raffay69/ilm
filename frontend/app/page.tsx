'use client'

import Image from "next/image"
import Link from "next/link"
import { BookOpen, Video, Users, ArrowRight, Download, Sparkles, Code, Brain, GraduationCap, Trash } from "lucide-react"
import TiltedCard from "@/components/tiltedCard"
import { Navbar, NavbarButton, NavbarLogo, NavBody, NavItems } from "@/components/navbar"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { useEffect, useRef, useState } from "react"
import { LoaderOne } from "@/components/loader"
import { useAuth } from "@clerk/nextjs"
import FadeIn from "@/components/fadeIn"
import { Dialog, DialogContent,  DialogTitle} from "@/components/ui/dialog"

export default function HomePage() {
  const [isSideBarOpen , setIsSideBarOpen] = useState(false)
  const { isSignedIn ,isLoaded} = useAuth()
  const [open, setOpen] = useState(false)


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

  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const shown = localStorage.getItem("welcome-shown");
      if (!shown && isSignedIn) {
        setOpen(true);
        localStorage.setItem("welcome-shown", "true");
      }
    }
  }, [isSignedIn]);

  
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
  return (
    <>
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
    <div className="min-h-screen relative">

      {/* Hero Section */}
      <FadeIn>
      <section className="relative py-20 lg:py-[170px]  overflow-hidden">
        <div className="absolute inset-0 bg-[#f5f0e8]"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundSize: "60px 60px",
            backgroundRepeat: "repeat",
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-8xl font-bold text-primary-800 font-arabic">ilm</h1>
                <p className="text-2xl lg:text-3xl text-primary-600 font-medium">Knowledge, Visualized</p>
              </div>

              <h2 className="text-3xl lg:text-5xl font-bold text-primary-900 leading-tight max-w-4xl mx-auto">
              Visualize Your<span className="text-primary-600"> Words</span><br />Revolutionize <span className="text-primary-600"> Learning</span>
              </h2>
              <p className="text-xl text-primary-700 font-arabic leading-relaxed max-w-3xl mx-auto">
                Experience education like never before. From complex academic concepts to coding challenges like
                LeetCode problems, get comprehensive explanations paired with engaging visual content that brings
                knowledge to life.
              </p>
            </div>

            <div className="flex justify-center">
              <Link href="/app" className="btn-primary inline-flex items-center justify-center group">
                Start Learning
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      </FadeIn>

      {/* Use Cases Section */}
      <FadeIn>
      <section className="py-20 bg-white relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundSize: "60px 60px",
            backgroundRepeat: "repeat",
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-900">Perfect For Every Learning Need</h2>
            <p className="text-xl text-primary-600 max-w-3xl mx-auto">
              Whether you're studying for exams, solving coding problems, or exploring new topics, ilm adapts to your
              learning style
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Academic Learning */}
            <FadeIn>
            <div className="card text-center space-y-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto">
                <GraduationCap className="w-10 h-10 text-blue-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-primary-800">Academic Subjects</h3>
                <p className="text-primary-600">
                  Master complex topics in physics, chemistry, biology, mathematics, and more with visual explanations.
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-700 font-medium mb-2">Examples:</div>
                <div className="space-y-1 text-sm text-blue-800">
                  <div>• "Explain quantum mechanics"</div>
                  <div>• "How does photosynthesis work?"</div>
                  <div>• "Calculus derivatives explained"</div>
                </div>
              </div>
            </div>
            </FadeIn>

            {/* Coding & Programming */}
            <FadeIn>
            <div className="card text-center space-y-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto">
                <Code className="w-10 h-10 text-green-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-primary-800">Coding & Algorithms</h3>
                <p className="text-primary-600">
                  Understand LeetCode problems, data structures, algorithms, and programming concepts with step-by-step
                  breakdowns.
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-700 font-medium mb-2">Examples:</div>
                <div className="space-y-1 text-sm text-green-800">
                  <div>• "Two Sum LeetCode solution"</div>
                  <div>• "Binary search algorithm"</div>
                  <div>• "Dynamic programming explained"</div>
                </div>
              </div>
            </div>
            </FadeIn>

            {/* General Knowledge */}
            <FadeIn>
            <div className="card text-center space-y-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto">
                <Brain className="w-10 h-10 text-purple-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-primary-800">General Knowledge</h3>
                <p className="text-primary-600">
                  Explore history, science, technology, and current events with comprehensive visual explanations.
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-purple-700 font-medium mb-2">Examples:</div>
                <div className="space-y-1 text-sm text-purple-800">
                  <div>• "How does blockchain work?"</div>
                  <div>• "World War II timeline"</div>
                  <div>• "Climate change explained"</div>
                </div>
              </div>
            </div>
            </FadeIn>
          </div>
        </div>
      </section>
      </FadeIn>

      {/* Interactive How it Works Section */}
      <FadeIn>
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50 relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundSize: "60px 60px",
            backgroundRepeat: "repeat",
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-900">How <span className="font-arabic text-primary-600 text-5xl">ilm </span>Works</h2>
            <p className="text-xl text-primary-600 max-w-3xl mx-auto">
              Our intelligent system transforms your educational queries into comprehensive learning experiences
            </p>
          </div>

          {/* Interactive Steps */}
          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-secondary-200 to-accent-200 transform -translate-y-1/2"></div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <FadeIn>
              <div className="group">
                <div className="card text-center space-y-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 relative">
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-10 h-10 text-primary-600" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-primary-800">Input Your Topic</h3>
                    <p className="text-primary-600">
                      Enter any topic, from academic subjects to coding problems like "Two Sum LeetCode" or "Explain
                      machine learning".
                    </p>
                  </div>
                  <div className="bg-primary-50 rounded-lg p-4">
                    <div className="text-sm text-primary-700 font-medium mb-2">Examples:</div>
                    <div className="space-y-1 text-sm text-primary-800">
                      <div className="bg-white rounded-md p-2 border border-primary-200">"Merge Sort algorithm"</div>
                      <div className="bg-white rounded-md p-2 border border-primary-200">"Explain photosynthesis"</div>
                    </div>
                  </div>
                </div>
              </div>
              </FadeIn>

              {/* Step 2 */}
              <FadeIn>
              <div className="group">
                <div className="card text-center space-y-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 relative">
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-secondary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-10 h-10 text-secondary-600" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-primary-800">AI Processing</h3>
                    <p className="text-primary-600">
                      Our advanced AI analyzes your query and generates comprehensive explanations tailored to your
                      learning needs.
                    </p>
                  </div>
                  <div className="bg-secondary-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-secondary-700 font-medium">Processing</span>
                      <span className="text-sm text-secondary-600">85%</span>
                    </div>
                    <div className="w-full bg-secondary-200 rounded-full h-2">
                      <div className="bg-secondary-600 h-2 rounded-full w-4/5 transition-all duration-1000"></div>
                    </div>
                  </div>
                </div>
              </div>
              </FadeIn>

              {/* Step 3 */}
              <FadeIn>
              <div className="group">
                <div className="card text-center space-y-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 relative">
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Video className="w-10 h-10 text-accent-600" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-primary-800">Visual Content</h3>
                    <p className="text-primary-600">
                      Receive detailed text explanations plus engaging videos that visualize algorithms, concepts, and
                      solutions.
                    </p>
                  </div>
                  <div className="bg-accent-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-accent-700 font-medium">Content Ready</span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-white rounded-md p-2 text-xs text-accent-800 border border-accent-200">
                        📄 Explanation
                      </div>
                      <div className="flex-1 bg-white rounded-md p-2 text-xs text-accent-800 border border-accent-200">
                        🎥 Visualization
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
      </FadeIn>

      {/* Benefits Section */}
      <FadeIn>
      <section className="py-20 bg-white relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundSize: "60px 60px",
            backgroundRepeat: "repeat",
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-primary-900">Why Choose <span className="font-arabic text-primary-600 text-5xl">ilm</span>?</h2>
                <p className="text-xl text-primary-700">
                  Experience the future of education with our innovative approach to learning
                </p>
              </div>

              <div className="space-y-6">
                <FadeIn>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-800">Comprehensive Explanations</h3>
                    <p className="text-primary-600">
                      Get detailed, step-by-step explanations for any topic, from calculus to coding algorithms
                    </p>
                  </div>
                </div>
                </FadeIn>

                <FadeIn>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-800">Visual Learning</h3>
                    <p className="text-primary-600">
                      Watch concepts come to life through engaging video content and algorithm visualizations
                    </p>
                  </div>
                </div>
                </FadeIn>

                <FadeIn>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-800">Coding Problem Solver</h3>
                    <p className="text-primary-600">
                      Perfect for understanding LeetCode problems, data structures, and programming concepts
                    </p>
                  </div>
                </div>
                </FadeIn>

                <FadeIn>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Download className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-800">Download & Share</h3>
                    <p className="text-primary-600">
                      Save your generated content for offline learning and share with study groups
                    </p>
                  </div>
                </div>
                </FadeIn>

                <FadeIn>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-800">For Everyone</h3>
                    <p className="text-primary-600">
                      Perfect for students, developers, educators, and lifelong learners
                    </p>
                  </div>
                </div>
                </FadeIn>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-white to-primary-50 relative overflow-hidden">
              <div className="relative space-y-6">
                <div className="text-center">
                  <div className="w-[300px] h-[300px] bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <TiltedCard
                      imageSrc="logo.png"
                      containerHeight="300px"
                      containerWidth="300px"
                      imageHeight="300px"
                      imageWidth="300px"
                      rotateAmplitude={12}
                      scaleOnHover={1.1}
                      captionText="ilm"
                    />
                  </div>
                  <p className="text-primary-600 mt-6">Knowledge in its purest form</p>
                </div>

                <div className="bg-primary-100 rounded-lg p-4 text-center">
                  <p className="text-primary-800 font-medium">
                    "From complex algorithms to scientific theories, ilm makes every concept crystal clear"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </FadeIn>

      {/* CTA Section */}
      <FadeIn>
      <section className="py-20 bg-primary-800 relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundSize: "60px 60px",
            backgroundRepeat: "repeat",
          }}
        ></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready to Transform Your Learning?</h2>
              <p className="text-xl text-primary-200">
                Join thousands of learners and developers who are already mastering complex topics with ilm
              </p>
            </div>

            <Link
              href="/app"
              className="inline-flex items-center justify-center bg-white text-primary-800 px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-50 transition-colors group"
            >
              Start Learning
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
      </FadeIn>

      {/* Footer */}
      <footer className="bg-primary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <Image src="/logo.png" alt="ilm logo" width={36} height={36} className="object-contain" />
              </div>
              <div>
                <span className="text-2xl font-bold font-arabic">ilm</span>
                <p className="text-sm text-primary-300">Knowledge, Visualized</p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-primary-300">© 2025 ilm. Empowering minds through visual learning.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}
