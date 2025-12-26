
import { researchAndGenerateViralArticles, generateArticleImage } from './geminiService';
import { createArticle } from './newsService';

export interface AutoPilotLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

class AutoPilotService {
  private isRunning = false;
  private interval: number = 3600; // 1 jam dalam detik
  private logs: AutoPilotLog[] = [];
  private onStatusChange: ((status: string) => void) | null = null;
  private onLogsChange: ((logs: AutoPilotLog[]) => void) | null = null;

  constructor() {
    this.logs = JSON.parse(localStorage.getItem('pamong_ai_logs') || '[]');
  }

  public getStatus() {
    return JSON.parse(localStorage.getItem('pamong_autopilot_enabled') || 'false');
  }

  public setStatus(enabled: boolean) {
    localStorage.setItem('pamong_autopilot_enabled', JSON.stringify(enabled));
    if (enabled && !this.isRunning) {
      this.addLog("🤖 Auto-Pilot diaktifkan oleh admin. Memulai pengawasan tren...", 'info');
      this.execute();
    } else if (!enabled) {
      this.addLog("👤 Auto-Pilot dinonaktifkan. Beralih ke mode manual.", 'warning');
    }
    if (this.onStatusChange) this.onStatusChange(enabled ? 'active' : 'idle');
  }

  private addLog(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const newLog: AutoPilotLog = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    this.logs = [newLog, ...this.logs].slice(0, 100);
    localStorage.setItem('pamong_ai_logs', JSON.stringify(this.logs));
    if (this.onLogsChange) this.onLogsChange(this.logs);
  }

  public async execute() {
    if (!this.getStatus() || this.isRunning) return;

    this.isRunning = true;
    try {
      this.addLog("📡 Memindai tren viral terbaru di Indonesia...", 'info');
      const rawArticles = await researchAndGenerateViralArticles();
      
      this.addLog(`📊 Tren terdeteksi! Mengolah ${rawArticles.length} berita.`, 'info');

      for (let i = 0; i < rawArticles.length; i++) {
        if (!this.getStatus()) break; // Berhenti jika dimatikan di tengah jalan

        const art = rawArticles[i];
        this.addLog(`🎨 Menghasilkan ilustrasi AI: ${art.title.substring(0, 30)}...`, 'info');

        let imageUrl = `https://picsum.photos/800/450?random=${Date.now() + i}`;
        try {
          imageUrl = await generateArticleImage(art.imagePrompt);
        } catch (e) {
          this.addLog(`⚠️ Gagal generate gambar khusus, menggunakan placeholder.`, 'warning');
        }

        await createArticle({
          title: art.title,
          content: art.content,
          summary: art.summary,
          category: art.category as any,
          imageUrl,
          author: "Pamong AI Bot",
          slug: art.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substr(2, 5),
          isBreaking: true
        });

        this.addLog(`✅ Terbit: ${art.title}`, 'success');
      }

      this.addLog("✨ Siklus selesai. Beristirahat sebelum pemindaian berikutnya.", 'success');
    } catch (error: any) {
      this.addLog(`❌ Gangguan Sistem: ${error.message}`, 'error');
    } finally {
      this.isRunning = false;
      // Re-trigger after delay if still enabled
      if (this.getStatus()) {
        setTimeout(() => this.execute(), this.interval * 1000);
      }
    }
  }

  public subscribe(onStatus: any, onLogs: any) {
    this.onStatusChange = onStatus;
    this.onLogsChange = onLogs;
  }
}

export const autoPilot = new AutoPilotService();
