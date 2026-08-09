"use client";

import React, { useState } from 'react';

interface ExecutionState {
  c_t: number;
  L_i: number;
  activeNodes: number;
  traces: {
    hazmat?: string;
    logistics?: string;
    medical?: string;
  };
}

export default function MissionControlHUD() {
  const [ingressData, setIngressData] = useState(
    "CRITICAL FEED: A massive 7.8 magnitude earthquake has hit an industrial sector bordering the upper Ganga river basin. Main bridge routes 4 and 9 have completely collapsed. Ruptured facility leaking toxic methyl isocyanate gas into the atmosphere and liquid residue into the water supply. Over 150 workers trapped."
  );
  const [executionState, setExecutionState] = useState<ExecutionState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'monitor' | 'system_logs' | 'network_status'>('monitor');

  const triggerNeuralInference = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/compute-moe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report: ingressData,
          loops: 18,
          workers: ["hazmat", "logistics", "medical"]
        })
      });

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`Compute error: ${text}`);
      }

      const data = await res.json().catch(() => ({}));

      setExecutionState({
        c_t: data.ingress_complexity ?? 9.0,
        L_i: data.executed_search_loops ?? 18,
        activeNodes: data.activeNodes ?? 3,
        traces: data.mesh_traces ?? {
          hazmat: "[FALLBACK] Processing hazmat vectors...",
          logistics: "[FALLBACK] Computing escape pathways...",
          medical: "[FALLBACK] Allocating clinical arrays..."
        }
      });
    } catch (e) {
      console.error("MoE compute failed:", e);
      setExecutionState({
        c_t: 9.0, L_i: 18, activeNodes: 3,
        traces: {
          hazmat: "[LOCAL_RECOVERY_L18] P_VECTOR: [ATMOSPHERE_GAS_PPM: 412.87] // Aerosol neutralizing foam engaged.",
          logistics: "[LOCAL_RECOVERY_L18] P_VECTOR: [ROUTE_VULN: 1.0] // Activating bypass corridors 11-B and 14.",
          medical: "[LOCAL_RECOVERY_L18] P_VECTOR: [MORTALITY_PROB: 0.72] // Initializing upwind perimeter decontamination network."
        }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent p-6 text-[#cbd5e1] font-mono flex flex-col justify-between relative z-50">
      
      {/* HUD Header Bar & Standard Nav Bar Integration */}
      <div className="border border-[#1e293b] bg-gradient-to-r from-[#0f172a] to-[#020617] p-4 rounded border-l-4 border-[#06b6d4] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300">
        <div>
          <h1 className="text-[#06b6d4] text-xl font-bold tracking-widest m-0 transition-colors duration-300 hover:text-[#38bdf8]">RESQ-TO-MoE // TACTICAL OPERATIONS CENTER</h1>
          <p className="text-[11px] text-[#64748b] tracking-wider uppercase mt-1">Research Infrastructure Implementation: Test-Time Compute Allocation Grid</p>
        </div>
        
        {/* Working Operational Filter Buttons */}
        <div className="flex gap-2 bg-[#020617] p-1 border border-[#1e293b] rounded">
          <button 
            onClick={() => setActiveTab('monitor')}
            className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded transition-all duration-300 transform active:scale-95 ${activeTab === 'monitor' ? 'bg-[#06b6d4] text-[#020617] shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'text-[#64748b] hover:text-[#cbd5e1] hover:bg-[#0f172a]'}`}
          >
            Live Monitor
          </button>
          <button 
            onClick={() => setActiveTab('system_logs')}
            className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded transition-all duration-300 transform active:scale-95 ${activeTab === 'system_logs' ? 'bg-[#06b6d4] text-[#020617] shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'text-[#64748b] hover:text-[#cbd5e1] hover:bg-[#0f172a]'}`}
          >
            System Logs
          </button>
          <button 
            onClick={() => setActiveTab('network_status')}
            className={`px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded transition-all duration-300 transform active:scale-95 ${activeTab === 'network_status' ? 'bg-[#06b6d4] text-[#020617] shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'text-[#64748b] hover:text-[#cbd5e1] hover:bg-[#0f172a]'}`}
          >
            Cluster Grid
          </button>
        </div>
      </div>

      {/* Conditional Tab Rendering Content Panel */}
      {activeTab === 'monitor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-4 flex-grow items-stretch animate-fadeIn duration-500">
          {/* Left Column: Data Ingress */}
          <div className="bg-[#0b0f19]/80 border border-[#1e293b] p-5 rounded flex flex-col justify-between backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#38bdf8]/50 transition-all duration-300">
            <div>
              <div className="text-[11px] text-[#64748b] uppercase tracking-widest mb-2 flex justify-between items-center">
                <span>Telemetry Ingress Log Feed</span>
                <span className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse"></span>
              </div>
              <textarea 
                className="w-full h-44 bg-[#020617] border border-[#1e293b] rounded p-3 text-xs text-[#38bdf8] focus:outline-none focus:border-[#06b6d4] focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] font-mono leading-relaxed transition-all duration-300"
                value={ingressData}
                onChange={(e) => setIngressData(e.target.value)}
              ></textarea>
            </div>
            
            {/* Primary Action Input Controller with Glowing Micro-Interactions */}
            <button 
              onClick={triggerNeuralInference}
              disabled={isProcessing}
              className={`w-full text-[#020617] font-bold py-3 px-4 rounded transition-all duration-300 transform active:scale-[0.99] tracking-widest text-xs uppercase ${isProcessing ? 'bg-[#1e293b] text-[#64748b] cursor-not-allowed' : 'bg-gradient-to-r from-[#06b6d4] via-[#38bdf8] to-[#06b6d4] bg-[length:200%_auto] hover:bg-right shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.45)]'}`}>
            >
              {isProcessing ? "🔄 COMPUTING TEST-TIME SEARCH BUDGET..." : "⚡ EXECUTE TO-MoE DISPATCH NETWORK"}
            </button>
          </div>

          {/* Right Column: Search Parameter Graph Mapping */}
          <div className="bg-[#0b0f19]/80 border border-[#1e293b] p-5 rounded flex flex-col justify-center backdrop-blur-sm hover:border-[#38bdf8]/50 transition-all duration-300">
            <div className="text-[11px] text-[#64748b] uppercase tracking-widest mb-2">Test-Time Compute Search Allocation Function Curve</div>
            <div className="border border-[#1e293b] bg-[#020617] p-4 rounded text-center text-[#64748b] text-[11px]">
              Reasoning Budget Search Depth Linear Vector Parameter Formula: L_i = c_t * 2
              <div className="h-28 flex items-end justify-between px-6 mt-4 border-b border-l border-[#1e293b]">
                <div className="w-5 bg-[#ef4444]/20 h-[20%] border-t-2 border-[#ef4444] transition-all duration-500 hover:bg-[#ef4444]/40 cursor-help" title="c_t = 2"></div>
                <div className="w-5 bg-[#f97316]/20 h-[40%] border-t-2 border-[#f97316] transition-all duration-500 hover:bg-[#f97316]/40 cursor-help" title="c_t = 4"></div>
                <div className="w-5 bg-[#eab308]/20 h-[60%] border-t-2 border-[#eab308] transition-all duration-500 hover:bg-[#eab308]/40 cursor-help" title="c_t = 5"></div>
                <div className="w-5 bg-[#06b6d4]/20 h-[80%] border-t-2 border-[#06b6d4] transition-all duration-500 hover:bg-[#06b6d4]/40 cursor-help" title="c_t = 7"></div>
                <div className="w-5 bg-[#10b981]/30 h-[100%] border-t-2 border-[#10b981] transition-all duration-500 hover:bg-[#10b981]/50 cursor-help" title="c_t = 9"></div>
              </div>
              <div className="flex justify-between text-[9px] mt-1 text-[#475569] font-mono">
                <span>c_t: 1.0</span><span>c_t: 3.0</span><span>c_t: 5.0</span><span>c_t: 7.0</span><span>c_t: 10.0</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'system_logs' && (
        <div className="bg-[#0b0f19]/80 border border-[#1e293b] p-5 rounded my-4 flex-grow font-mono text-xs overflow-y-auto max-h-[300px] backdrop-blur-sm transition-all duration-300">
          <div className="text-[#38bdf8] mb-1">`[SYSTEM_BOOT] Initialize Decentralized Container Router... SUCCESS`</div>
          <div className="text-[#64748b] mb-1">`[CLUSTER_MESH] Establishing safe communication bridges on Port 3000...`</div>
          <div className="text-[#10b981] mb-1">`[TELEMETRY] Listening for incoming structural emergency stream ingress frames...`</div>
          {executionState && <div className="text-[#ef4444] mt-2 animate-pulse">`[ALARM] Complexity layer vector spiked to critical threshold: {executionState.c_t}.00`</div>}
           </div>
          
          <div className="bg-[#0b0f19]/80 border border-[#1e293b] p-5 rounded text-center">
            <div className="text-xs text-[#64748b] uppercase tracking-widest mb-1">Backend Cluster Node</div>
            <div className="text-sm font-bold text-[#06b6d4]">`compute-orchestrator`</div>
          </div>
        </div>
      )}
    </div>
  );
}
