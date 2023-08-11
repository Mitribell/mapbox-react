import React from "react"
import "./sidebar.css"

export default function Sidebar() {
    return (
        <div className='sidebar md:basis-1/4 basis-full h-screen overflow-y-scroll'>
            <div className='heading'>
                <h1 className='text-lg font-semibold m-6'>Локації та ініціативи</h1>                
                <div class="relative m-6">
                    <div class="absolute pl-3 inset-y-0 left-0 flex pointer-events-none items-center">
                        <svg class="absolute text-slate-400 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <input id="search" type="text" placeholder="Шукати" className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" />                    
                </div>
            </div>            
            <div id='listings' className='listings divide-y'>

            </div>
        </div>
    );
}