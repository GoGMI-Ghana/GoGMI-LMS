import { useState, useCallback } from "react";
import { useApi } from "../../hooks/useApi";
import { LoadingSpinner } from "../../components/common";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const ASSET_BASE = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:3001";

interface FileItem { filename: string; path: string; url: string; size: number; modified: string; }
interface FilesResponse { files: FileItem[]; folders: string[]; }

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx"].includes(ext)) return "doc";
  if (["ppt", "pptx"].includes(ext)) return "ppt";
  if (ext === "mp4") return "video";
  return "file";
}

export default function AdminFilesPage() {
  const [activeType, setActiveType] = useState<"images" | "materials">("images");
  const [activeFolder, setActiveFolder] = useState("");
  const { data, isLoading, refetch } = useApi<FilesResponse>("/uploads?type=" + activeType + (activeFolder ? "&folder=" + activeFolder : ""));

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(""); setUploadSuccess(""); setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        
        const res = await fetch(API_BASE + "/uploads?type=" + activeType + (activeFolder ? "&folder=" + activeFolder : ""), {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            "Authorization": "Bearer " + (window as unknown as Record<string, string>).__accessToken || "",
          },
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Upload failed" }));
          throw new Error(err.error);
        }
      }
      setUploadSuccess(files.length + " file" + (files.length > 1 ? "s" : "") + " uploaded successfully");
      refetch();
      setTimeout(() => setUploadSuccess(""), 3000);
    } catch (err) { setUploadError(err instanceof Error ? err.message : "Upload failed"); }
    finally { setUploading(false); }
  }, [activeType, activeFolder, refetch]);

  const handleDelete = async (filePath: string) => {
    if (!confirm("Delete this file? This cannot be undone.")) return;
    try {
      const res = await fetch(API_BASE + "/uploads?path=" + encodeURIComponent(filePath), {
        method: "DELETE",
        credentials: "include",
        headers: { "Authorization": "Bearer " + (window as unknown as Record<string, string>).__accessToken || "" },
      });
      if (!res.ok) throw new Error("Delete failed");
      refetch();
    } catch { setUploadError("Failed to delete file"); }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  if (isLoading) return <LoadingSpinner />;

  const files = data?.files || [];
  const folders = data?.folders || [];

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-800 mb-1">File Manager</h1>
          <p className="text-[14px] text-gray-500">Upload and manage course images, materials, and documents.</p>
        </div>
      </div>

      {/* Type tabs */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex gap-1.5">
          {(["images", "materials"] as const).map(type => (
            <button key={type} onClick={() => { setActiveType(type); setActiveFolder(""); }} className={`px-4 py-2 rounded-md text-[13px] font-medium transition-colors cursor-pointer capitalize ${activeType === type ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
              {type === "images" ? "Course Images" : "Course Materials"}
            </button>
          ))}
        </div>

        {/* Breadcrumb */}
        {activeFolder && (
          <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
            <button onClick={() => setActiveFolder("")} className="text-brand-teal hover:underline cursor-pointer">{activeType}</button>
            <span>/</span>
            <span className="text-gray-800 font-medium">{activeFolder}</span>
          </div>
        )}
      </div>

      {/* Subfolders */}
      {folders.length > 0 && !activeFolder && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[12px] text-gray-500 uppercase tracking-wider">Folders:</span>
          {folders.map(f => (
            <button key={f} onClick={() => setActiveFolder(f)} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-md px-3 py-1.5 text-[13px] text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-brand-amber"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
              {f}
            </button>
          ))}
          <button onClick={() => setShowNewFolder(true)} className="flex items-center gap-1 text-[12px] text-brand-teal font-medium hover:underline cursor-pointer ml-2">+ New folder</button>
        </div>
      )}

      {/* Upload zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${dragOver ? "border-brand-teal bg-brand-teal/5" : "border-gray-200 bg-white"}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-400 mx-auto mb-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
        <p className="text-[14px] text-gray-600 mb-1">Drag and drop files here, or</p>
        <label className="inline-block bg-gray-900 text-white rounded-md px-5 py-2 text-[13px] font-medium cursor-pointer hover:bg-gray-800 transition-colors mt-2">
          Browse Files
          <input type="file" multiple className="hidden" onChange={e => handleUpload(e.target.files)} />
        </label>
        <p className="text-[11.5px] text-gray-400 mt-3">Max 50MB per file. Accepted: JPG, PNG, PDF, DOC, DOCX, PPT, PPTX, MP4</p>
      </div>

      {uploading && <div className="flex items-center gap-2 mb-4"><svg className="animate-spin h-4 w-4 text-brand-teal" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg><span className="text-[13px] text-gray-600">Uploading...</span></div>}
      {uploadError && <div className="bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-red-700">{uploadError}</p></div>}
      {uploadSuccess && <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mb-4"><p className="text-[13px] text-green-700">{uploadSuccess}</p></div>}

      {/* Files grid */}
      {files.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {files.map(file => {
            const type = getFileType(file.filename);
            const fullUrl = ASSET_BASE + file.url;
            return (
              <div key={file.filename} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors group">
                {/* Preview area */}
                <div className="h-36 bg-gray-50 flex items-center justify-center relative overflow-hidden cursor-pointer" onClick={() => type === "image" ? setPreviewUrl(fullUrl) : window.open(fullUrl, "_blank")}>
                  {type === "image" ? (
                    <img src={fullUrl} alt={file.filename} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-[11px] font-bold text-white uppercase ${type === "pdf" ? "bg-red-500" : type === "doc" ? "bg-blue-500" : type === "ppt" ? "bg-orange-500" : type === "video" ? "bg-purple-500" : "bg-gray-500"}`}>
                        {type}
                      </div>
                    </div>
                  )}
                  {/* Copy URL overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(file.url); setUploadSuccess("Path copied!"); setTimeout(() => setUploadSuccess(""), 2000); }} className="bg-white rounded-md px-3 py-1.5 text-[11px] font-medium text-gray-800 cursor-pointer">Copy Path</button>
                    <button onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(fullUrl); setUploadSuccess("URL copied!"); setTimeout(() => setUploadSuccess(""), 2000); }} className="bg-white rounded-md px-3 py-1.5 text-[11px] font-medium text-gray-800 cursor-pointer">Copy URL</button>
                  </div>
                </div>
                {/* File info */}
                <div className="p-3">
                  <div className="text-[12px] font-medium text-gray-800 truncate" title={file.filename}>{file.filename}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-gray-400">{formatSize(file.size)}</span>
                    <button onClick={() => handleDelete(file.path)} className="text-[11px] text-red-500 font-medium hover:underline cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg py-16 flex flex-col items-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-300 mb-3"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
          <h3 className="text-[15px] font-semibold text-gray-800 mb-1">No files yet</h3>
          <p className="text-[13px] text-gray-500">Upload your first file using the area above.</p>
        </div>
      )}

      {/* Image preview modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] cursor-pointer" onClick={() => setPreviewUrl(null)}>
          <img src={previewUrl} alt="" className="max-w-[80vw] max-h-[80vh] rounded-lg shadow-2xl" />
        </div>
      )}

      {/* New folder modal */}
      {showNewFolder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100]" onClick={() => setShowNewFolder(false)}>
          <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-[16px] font-semibold text-gray-800 mb-4">Create Folder</h2>
            <input type="text" value={newFolder} onChange={e => setNewFolder(e.target.value.replace(/[^a-zA-Z0-9-_]/g, "-").toLowerCase())} placeholder="e.g. maritime-governance" className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] text-gray-800 outline-none focus:border-brand-teal transition-colors mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowNewFolder(false)} className="flex-1 border border-gray-200 rounded-md py-2 text-[13px] font-medium text-gray-600 cursor-pointer hover:bg-gray-50">Cancel</button>
              <button onClick={() => { setActiveFolder(newFolder); setShowNewFolder(false); setNewFolder(""); }} className="flex-1 bg-gray-900 text-white rounded-md py-2 text-[13px] font-medium cursor-pointer hover:bg-gray-800">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}