"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {Trash} from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "./ui/skeleton"
import { SignedIn, useAuth, UserButton , useUser } from "@clerk/nextjs"
import axios from 'axios'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import Link from "next/link"

type GenerationState = "idle" | "generating-text" | "generating-video" | "complete"

interface ClaudeSidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  color : string
  setResults : React.Dispatch<React.SetStateAction<{
    explanation: string
    quality: "low" | "high"
  } | null>>
  setVideoURL : React.Dispatch<React.SetStateAction<String|null>>
  setGenerationState : React.Dispatch<React.SetStateAction<GenerationState>>
}

type ContentItem = {
    _id: number;
    fileName: string;
    content : string;
    videoURL : string;
    quality : string 
  };

export function ClaudeSidebar({isOpen, setIsOpen , color , setResults , setVideoURL , setGenerationState }: ClaudeSidebarProps) {
    const [content, setContent] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
   const pathName = usePathname()
   const router = useRouter()
   const {isSignedIn , getToken} = useAuth()
   const {user} = useUser()


   const fetchData = async () => {
    try {
      const token = await getToken()
      const res = await axios.get('http://localhost:4000/db/recents' , {
        headers : {
          Authorization :  `Bearer ${token}`
        }
      })
      const sortedContent = res.data
      setContent(sortedContent);
    } catch (error) {
      console.error("Error fetching user content:", error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

   useEffect(() => { 
    fetchData();
  }, [isSignedIn , isOpen  ]);

  async function deleteChat(fileName:String){
    console.log(`from the delete func ${fileName}`)
    const token = await getToken()
    try{
    await axios.put('http://localhost:4000/db/remove' , { 
      fileName : fileName
    },{
      headers : {
        Authorization : `Bearer ${token}`
      }
    })
    toast.success("Chat deleted successfully")
    setResults(null)
    setVideoURL(null)
    setGenerationState("idle")
    fetchData()
  }catch(e:any){
    toast.error("Error while deleting the chat")
  }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 z-[99] backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "tween", duration: 0.15, ease: "easeInOut" }}
        className="fixed top-0 left-0 h-full w-[280px] z-[99] backdrop-blur-md bg-primary-200/80 border-r border-[var(--border-color)]" style={{"--border-color":color} as React.CSSProperties }
        >
        <div className="flex flex-col h-full text-gray-200">
          {/* Header with Logo */}
          <div className="flex items-center justify-between p-2 border-b border-[var(--border-color)]" style={{"--border-color":color} as React.CSSProperties }>
            <div className="flex items-center">
              <Link
                href="/"
                className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-black"
                >
                <span className="text-6xl pl-2 mt-2 ml-6 font-bold text-primary-900 font-arabic">ilm</span>
                </Link>
            </div>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 overflow-y-auto py-1 scrollbar-primary-900 `}>
            <div className="px-3 py-2">
              <h3 className="text-md font-arabic text-secondary-900 uppercase tracking-wider mb-2">Recents</h3> 
              <ul className="space-y-1">
              {loading ? (
                // Skeleton loading state
                <>
                  <li>
                    <div className="px-2 py-1">
                      <Skeleton className="h-8 w-full rounded-md" />
                    </div>
                  </li>
                  <li>
                    <div className="px-2 py-1">
                      <Skeleton className="h-8 w-full rounded-md" />
                    </div>
                  </li>
                  <li>
                    <div className="px-2 py-1">
                      <Skeleton className="h-8 w-full rounded-md" />
                    </div>
                  </li>
                  <li>
                    <div className="px-2 py-1">
                      <Skeleton className="h-8 w-full rounded-md" />
                    </div>
                  </li>
                  <li>
                    <div className="px-2 py-1">
                      <Skeleton className="h-8 w-full rounded-md" />
                    </div>
                  </li>
                </>
              ) : content.length > 0 ? (
                content.map((item) => (
                  <div key={item._id} className="flex justify-between">  
                  <li 
                  key={item._id}
                  onClick={()=> {
                    setVideoURL(item.videoURL)
                    setResults({
                        explanation : item.content,
                        quality : item.quality as "low" | "high"
                    })
                    setGenerationState("complete")
                }}
                  className={` p-1 rounded cursor-pointer hover:bg-primary-300`}
                  >
                  <p className="text-black font-arabic text-lg">{item.fileName}</p>
                </li>
                <Dialog>
                  <DialogTrigger><Trash className="w-4 h-4 text-red-500" ></Trash></DialogTrigger>
                  <DialogContent className="">
                  <DialogHeader>
                    <DialogTitle className="font-arabic text-2xl text-pretty">Are you sure you want to delete <span className="font-arabic text-black">{item.fileName}</span>?</DialogTitle>
                    <DialogDescription className="font-arabic text-md">
                      This action is permanent. The chat will be permanently removed and cannot be recovered.
                    </DialogDescription>
                  </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button className="bg-black text-white">Cancel</Button>
                      </DialogClose>
                      <Button className="text-red-500 bg-black" onClick={()=>deleteChat(item.fileName)}>Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
                ))
              ) : (
                <li>
                  <div className="px-2 py-1 text-sm text-gray-500">No Recent chats</div>
                </li>
              )}
              </ul>
            </div>
            </nav>

          {/* Footer */}
          <div className="p-4 border-t border-black flex gap-2 ">
          <SignedIn>
              <UserButton />
              <span className="text-secondary-900 font-arabic text-lg mt-0.5">{user?.fullName}</span>
            </SignedIn>
          </div>
        </div>
      </motion.div>

      {/* Trigger area - always visible at the edge */}
      <div className="fixed top-0 left-0 w-1 h-full z-30 bg-transparent" onMouseEnter={() => setIsOpen(true)} />
    </>
  )
}

