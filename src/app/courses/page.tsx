'use client';
import { useState } from 'react';
import { COURSES, CATEGORY_EMOJIS } from '@/lib/data';
import { MapPin, Clock, User, Tag } from 'lucide-react';

const CATS = ['全部', 'AI', 'HR', '行銷', '管理', '心理', '勞資'];

export default function CoursesPage() {
  const [cat, setCat] = useState('全部');
  const filtered = cat === '全部' ? COURSES : COURSES.filter(c => c.category === cat);

  return (
    <div>
      <div className="page-header">
        <h1 className="text-4xl font-bold text-white mb-2" style={{fontFamily:'Noto Serif TC,serif'}}>📚 課程培訓</h1>
        <p className="text-white/60">由實戰專家授課，知識與行動並進</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border
                ${cat === c ? 'bg-[#3B6D11] text-white border-[#3B6D11]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#3B6D11]'}`}>
              {CATEGORY_EMOJIS[c] || ''} {c}
            </button>
          ))}
        </div>
        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(course => (
            <div key={course.id} className="card overflow-hidden group">
              <div className="h-40 bg-gradient-to-br from-[#1a3a0f] to-[#639922] flex items-center justify-center relative">
                <span className="text-5xl">{CATEGORY_EMOJIS[course.category] || '📘'}</span>
                <span className="absolute top-3 left-3 bg-white/20 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">{course.category}</span>
                <span className="absolute top-3 right-3 bg-[#EAF3DE] text-[#3B6D11] text-xs px-2.5 py-1 rounded-full font-medium">招生中</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#1a3a0f] mb-3 leading-snug text-sm">{course.name}</h3>
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={13} /> {course.date} {course.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <User size={13} /> {course.instructor} 講師
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin size={13} /> 台中文心路四段955號17樓
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-lg font-bold text-[#3B6D11]">NT${course.price.toLocaleString()}</div>
                  <button className="bg-[#3B6D11] hover:bg-[#27500a] text-white text-sm px-4 py-1.5 rounded-full transition-all">
                    立即報名
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
