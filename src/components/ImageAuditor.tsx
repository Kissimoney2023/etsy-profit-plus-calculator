
import React, { useState, useRef } from 'react';
import { Upload, X, Check, AlertTriangle, Scan, Sparkles, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

interface ScanResult {
    score: number;
    strengths: string[];
    improvements: string[];
    verdict: string;
}

export const ImageAuditor: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 4 * 1024 * 1024) {
                setError("Image size must be less than 4MB");
                return;
            }
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setResult(null);
            setError(null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            if (selectedFile.type.startsWith('image/')) {
                setFile(selectedFile);
                setPreviewUrl(URL.createObjectURL(selectedFile));
                setResult(null);
                setError(null);
            }
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove the "data:image/jpeg;base64," prefix
                const base64String = reader.result as string;
                const cleanBase64 = base64String.split(',')[1];
                resolve(cleanBase64);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleAudit = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const base64 = await convertToBase64(file);

            const { data, error: functionError } = await supabase.functions.invoke('audit-image', {
                body: {
                    image: base64,
                    mimeType: file.type
                }
            });

            if (functionError) throw functionError;
            setResult(data);

        } catch (err: any) {
            console.error('Audit failed:', err);
            setError(err.message || "Failed to analyze image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500 from-green-500 to-emerald-400';
        if (score >= 60) return 'text-yellow-500 from-yellow-500 to-orange-400';
        return 'text-red-500 from-red-500 to-pink-500';
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <Link to="/" className="text-slate-400 hover:text-primary mb-2 inline-flex items-center text-sm font-medium transition-colors">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-secondary dark:text-white flex items-center gap-3">
                        <Camera className="w-8 h-8 text-primary" />
                        AI Image Auditor
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full border border-primary/20">BETA</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        Upload your product photo. AI will simulate a buyer's eye and score it.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Upload & Preview */}
                <div className="space-y-6">
                    <div
                        className={`glass rounded-[30px] p-8 min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed transition-all relative overflow-hidden
                ${previewUrl ? 'border-primary/50 bg-primary/5' : 'border-slate-300 dark:border-slate-700 hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
            `}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        {previewUrl ? (
                            <div className="relative w-full h-full flex flex-col items-center">
                                <img src={previewUrl} alt="Preview" className="max-h-[350px] w-auto rounded-xl shadow-2xl" />
                                <button
                                    onClick={() => { setFile(null); setPreviewUrl(null); setResult(null); }}
                                    className="absolute top-0 right-0 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                {!result && !loading && (
                                    <div className="mt-8 w-full max-w-xs">
                                        <button
                                            onClick={handleAudit}
                                            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 group"
                                        >
                                            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                            Run Audit
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary animate-pulse">
                                    <Upload className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">Upload Product Image</h3>
                                <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">drag & drop or click to browse (Max 4MB)</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        )}

                        {/* Scanning Effect Overlay */}
                        {loading && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                <div className="relative w-24 h-24 mb-6">
                                    <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                    <div className="absolute inset-2 border-4 border-t-transparent border-r-secondary dark:border-r-white border-b-transparent border-l-transparent rounded-full animate-spin-slow opacity-50"></div>
                                </div>
                                <p className="text-white font-bold text-xl animate-pulse">Scanning Pixels...</p>
                                <p className="text-white/60 text-sm mt-2">Checking lighting & composition</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Results */}
                <div className={`transition-all duration-700 ${result ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-50'}`}>
                    {result ? (
                        <div className="space-y-6">
                            {/* Score Card */}
                            <div className="glass p-8 rounded-[30px] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-1">Impact Score</h3>
                                        <p className="text-xs text-slate-500">Based on Etsy standards</p>
                                    </div>
                                    <div className={`text-6xl font-black font-heading bg-clip-text text-transparent bg-gradient-to-r ${getScoreColor(result.score)}`}>
                                        {result.score}
                                    </div>
                                </div>

                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(result.score)} transition-all duration-1000 ease-out`}
                                        style={{ width: `${result.score}%` }}
                                    ></div>
                                </div>
                                <p className="mt-6 text-lg font-medium text-slate-600 dark:text-slate-300 italic">
                                    "{result.verdict}"
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Strengths */}
                                <div className="glass p-6 rounded-[24px] border-l-4 border-l-green-400">
                                    <h4 className="text-lg font-bold text-secondary dark:text-white mb-4 flex items-center gap-2">
                                        <Check className="w-5 h-5 text-green-500" />
                                        Winning Points
                                    </h4>
                                    <ul className="space-y-3">
                                        {result.strengths.map((str, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0"></span>
                                                {str}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Improvements */}
                                <div className="glass p-6 rounded-[24px] border-l-4 border-l-orange-400">
                                    <h4 className="text-lg font-bold text-secondary dark:text-white mb-4 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                                        Fix These
                                    </h4>
                                    <ul className="space-y-3">
                                        {result.improvements.map((imp, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0"></span>
                                                {imp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center p-8 opacity-50">
                            <div className="text-center max-w-sm">
                                <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-400 dark:text-slate-500">Waiting for image...</h3>
                                <p className="text-slate-400 mt-2">Upload a photo to see how AI rates its clickability, lighting, and composition.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
