
import React, { useRef, useEffect, useState } from 'react';
import { fetchSettings } from '../services/newsService';

// Declare global tinymce
declare global {
  interface Window {
    tinymce: any;
  }
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorId = useRef(`tinymce_editor_${Math.random().toString(36).substring(2)}`).current;
  const isInit = useRef(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Memuat editor...');

  // Step 1: Load TinyMCE Script with Dynamic API Key
  useEffect(() => {
      const loadScript = async () => {
          if (window.tinymce) {
              setIsScriptLoaded(true);
              return;
          }

          try {
              const settings = await fetchSettings();
              const apiKey = settings.tinymceApiKey || 'ib4xq52eiioizp66vv4dkknyj85bv3iqv9adxepq00vkzbxw'; // Fallback to default
              
              // Check if script already exists in head to prevent duplicates
              if (document.getElementById('tinymce-script')) {
                  // Wait for existing script to load
                  const existingScript = document.getElementById('tinymce-script') as HTMLScriptElement;
                  existingScript.addEventListener('load', () => setIsScriptLoaded(true));
                  return;
              }

              const script = document.createElement('script');
              script.id = 'tinymce-script';
              script.src = `https://cdn.tiny.cloud/1/${apiKey}/tinymce/7/tinymce.min.js`;
              script.referrerPolicy = 'origin';
              script.async = true;
              
              script.onload = () => {
                  setIsScriptLoaded(true);
              };
              
              script.onerror = () => {
                  setLoadingMessage('Gagal memuat editor. Periksa koneksi atau API Key.');
              };

              document.head.appendChild(script);
          } catch (e) {
              setLoadingMessage('Error memuat konfigurasi.');
          }
      };

      loadScript();
  }, []);

  // Step 2: Initialize Editor once script is ready
  useEffect(() => {
    if (!isScriptLoaded) return;

    let timer: ReturnType<typeof setInterval>;

    const initEditor = () => {
        if (!window.tinymce) return;
        
        const element = document.getElementById(editorId);
        if (!element) return;

        if (window.tinymce.get(editorId)) {
            window.tinymce.get(editorId).remove();
        }

        window.tinymce.init({
            selector: `#${editorId}`,
            height: 500,
            menubar: false,
            placeholder: placeholder,
            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            content_style: 'body { font-family:"Playfair Display", serif; font-size:16px; color: #1a1a1a; background-color: #ffffff; margin: 1rem; }',
            setup: (editor: any) => {
                editor.on('init', () => {
                    isInit.current = true;
                    if (value) editor.setContent(value);
                });
                
                editor.on('Change KeyUp', () => {
                    const content = editor.getContent();
                    onChange(content);
                });
            }
        });
    };

    // Polling to ensure DOM and Object readiness
    const checkReady = () => {
        if (window.tinymce && document.getElementById(editorId)) {
            if (timer) clearInterval(timer);
            initEditor();
        }
    };

    checkReady();
    timer = setInterval(checkReady, 100);

    return () => {
        if (timer) clearInterval(timer);
        isInit.current = false;
        if (window.tinymce) {
            const editor = window.tinymce.get(editorId);
            if (editor) editor.remove();
        }
    };
  }, [isScriptLoaded]); 

  // Step 3: Handle External Value Changes
  useEffect(() => {
      if (window.tinymce && isInit.current) {
          const editor = window.tinymce.get(editorId);
          if (editor) {
              const currentContent = editor.getContent();
              if (value !== currentContent && value !== undefined) {
                  editor.setContent(value);
              }
          }
      }
  }, [value, editorId]);

  return (
    <div className="rounded border border-gray-300 overflow-hidden shadow-sm min-h-[500px] bg-gray-50 relative">
        {!isScriptLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                {loadingMessage}
            </div>
        )}
        <textarea 
            id={editorId} 
            style={{ visibility: 'hidden', height: '500px' }} 
            defaultValue={value}
        />
    </div>
  );
};

export default RichTextEditor;
