"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, Download, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { convertPngToJpg } from "@/lib/converter";
import { useConversionStore } from "@/store/useConversionStore";
import { cn } from "@/lib/utils";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [outputSrc, setOutputSrc] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addRecord = useConversionStore((state) => state.addRecord);
  const history = useConversionStore((state) => state.history);

  const handleFileChange = (file: File | undefined | null) => {
    setError(null);
    setOutputSrc(null);
    
    if (!file) return;

    if (file.type !== "image/png") {
      setError("Please select a valid PNG image.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewSrc(objectUrl);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const targetFile = e.dataTransfer.files?.[0];
    handleFileChange(targetFile);
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    const recordId = crypto.randomUUID();

    try {
      // Simulate slight processing delay for user feedback on "distributed" UI look
      await new Promise((r) => setTimeout(r, 800));

      const convertedDataUrl = await convertPngToJpg(selectedFile);
      setOutputSrc(convertedDataUrl);

      addRecord({
        id: recordId,
        originalName: selectedFile.name,
        originalSize: selectedFile.size,
        timestamp: Date.now(),
        status: "success",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to process the image.");
      addRecord({
        id: recordId,
        originalName: selectedFile.name,
        originalSize: selectedFile.size,
        timestamp: Date.now(),
        status: "failed",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputSrc || !selectedFile) return;
    
    const link = document.createElement("a");
    link.href = outputSrc;
    const cleanName = selectedFile.name.replace(/\.png$/i, "");
    link.download = `${cleanName}-gokil.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    if (previewSrc) URL.revokeObjectURL(previewSrc);
    setSelectedFile(null);
    setPreviewSrc(null);
    setOutputSrc(null);
    setError(null);
  };

  return (
    <div className={cn("min-h-screen", "flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6")}>
      
      {/* HEADER */}
      <div className="text-center mb-8 max-w-xl">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Gokil Conversion 🗿
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Client-side Distributed Data Processing Simulation. Convert your PNG files to highly optimized JPG locally in your browser.
        </p>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        
        {/* LEFT COMPONENT - UPLOAD & PREVIEW */}
        <div className="flex flex-col gap-4">
          <div 
            className={cn(
              "flexcc h-[300px] border-2 border-dashed rounded-2xl transall relative overflow-hidden",
              isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900",
              selectedFile ? "border-solid border-zinc-200 dark:border-zinc-800" : "hover:border-zinc-400 dark:hover:border-zinc-700 cursor-pointer"
            )}
            style={{ padding: selectedFile ? '0px' : '24px' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !selectedFile && fileInputRef.current?.click()}
          >
            
            <AnimatePresence mode="wait">
              {!selectedFile ? (
                <motion.div 
                  key="upload-prompt"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flexcc text-center pointer-events-none"
                >
                  <UploadCloud className="w-12 h-12 text-zinc-400 mb-4" />
                  <p className="font-medium text-zinc-700 dark:text-zinc-200">Drag & Drop your PNG here</p>
                  <p className="text-sm text-zinc-500 mt-1">or click to browse from device</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="preview-image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full relative group"
                >
                  <img src={previewSrc!} alt="Preview" className="w-full h-full object-cover object-center" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transall flexcc">
                    <button onClick={resetAll} className="px-4 py-2 bg-white text-black font-semibold rounded-lg shadow transform hover:scale-105 transall">
                      Change File
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/png" 
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleConvert}
            disabled={!selectedFile || isProcessing || !!outputSrc}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-white shadow-lg transall flexcc gap-2",
              !selectedFile || !!outputSrc ? "bg-zinc-400 dark:bg-zinc-800 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/25 active:scale-[0.98]"
            )}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Convert to JPG"
            )}
          </button>
        </div>

        {/* RIGHT COMPONENT - RESULT & METADATA */}
        <div className="flex flex-col gap-4">
          <div className={cn(
            "flexcc h-[300px] border-2 rounded-2xl transall relative overflow-hidden",
            outputSrc ? "border-solid border-green-500/30 bg-green-50/50 dark:bg-green-900/10" : "border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
          )}>
            <AnimatePresence mode="wait">
              {outputSrc ? (
                 <motion.div 
                 key="output-image"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="w-full h-full relative"
               >
                 <img src={outputSrc} alt="Converted" className="w-full h-full object-cover object-center" />
                 <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
                    <CheckCircle2 className="w-5 h-5" />
                 </div>
               </motion.div>
              ) : (
                <motion.div 
                  key="output-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flexcc text-center text-zinc-400 dark:text-zinc-600"
                >
                  <p>Converted file will appear here</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleDownload}
            disabled={!outputSrc}
            className={cn(
              "w-full py-4 rounded-xl font-bold border-2 transall flexcc gap-2",
              !outputSrc 
                ? "border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed" 
                : "border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 active:scale-[0.98]"
            )}
          >
            <Download className="w-5 h-5" />
            Download JPG
          </button>
        </div>
      </div>

      {/* FOOTER HISTORY */}
      <div className="mt-12 w-full max-w-3xl">
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">Recent Conversions</h3>
        {history.length === 0 ? (
          <p className="text-zinc-400 text-sm italic">No conversions yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {history.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <div className="flex items-center gap-3">
                  {item.status === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm font-medium truncate max-w-[200px]">{item.originalName}</span>
                </div>
                <div className="text-xs text-zinc-500">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
