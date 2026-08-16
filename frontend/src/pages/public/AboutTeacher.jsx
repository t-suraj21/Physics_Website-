import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import axios from '../../api/axios';
import Loader from '../../components/common/Loader';
import { Award, BookOpen, GraduationCap, Heart, CheckCircle2 } from 'lucide-react';

const AboutTeacher = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get('/auth/teacher');
        setTeacher(res.data);
      } catch (err) {
        console.error('Failed to load teacher profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, []);

  const credentials = [
    {
      title: 'Academic Experience',
      desc: 'Over 12 years of physics instruction in college-preparatory and high-school academies.',
      icon: GraduationCap,
      color: 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
    },
    {
      title: 'Specialized Syllabus',
      desc: 'Expertise in AP Physics, SAT Subject Test prep, and national high school board syllabi.',
      icon: BookOpen,
      color: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
    },
    {
      title: 'Award Winning Teaching',
      desc: 'Recognized for excellent pedagogical innovation and student score achievements.',
      icon: Award,
      color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
    }
  ];

  if (loading) return <Loader fullPage={false} />;

  const getInitials = (name) => {
    if (!name) return 'RK';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-16">
      {/* Profile & Biography Header */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Profile Photo Mock */}
        <div className="md:col-span-4 flex justify-center">
          <div className="relative w-64 h-64 rounded-3xl overflow-hidden border border-slate-900 shadow-2xl bg-slate-900/30 flex items-center justify-center">
            {/* Soft background shape */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-accent-500/10 z-0"></div>
            
            {teacher?.avatar ? (
              <img 
                src={teacher.avatar} 
                alt={teacher.name} 
                className="w-full h-full object-cover z-10" 
              />
            ) : (
              <div className="z-10 text-center">
                <span className="text-7xl font-extrabold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  {getInitials(teacher?.name)}
                </span>
                <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">Instructor Photo</p>
              </div>
            )}
          </div>
        </div>

        {/* Bio text */}
        <div className="md:col-span-8 space-y-4 text-left">
          <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">Founder & Lead Educator</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Meet {teacher?.name || 'Prof. Raj Kumar'}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            With a Master's degree in Applied Physics and over a decade of classroom instruction experience, I established Physics Academy to make physics concepts simple, intuitive, and accessible to everyone.
          </p>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            My teaching methodology goes beyond formulas. We focus on building strong physical models and intuitive mental frameworks, enabling students to tackle tough numerical problems with ease.
          </p>
          <div className="pt-2 flex flex-col space-y-1.5 text-xs text-slate-455 font-bold">
            <p>Email: <span className="text-slate-300 font-semibold">{teacher?.email || 'rajkumar@physics.edu'}</span></p>
            {teacher?.phone && (
              <p>Phone: <span className="text-slate-300 font-semibold">{teacher.phone}</span></p>
            )}
          </div>
        </div>
      </section>

      {/* Teaching Qualifications */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white text-center uppercase tracking-tight">Credentials & Background</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {credentials.map((cred, idx) => {
            const Icon = cred.icon;
            return (
              <Card key={idx} className="p-6 space-y-4">
                <div className={`p-3 rounded-xl w-fit ${cred.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-100">
                  {cred.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed text-left">
                  {cred.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Philosophy Statement */}
      <section className="bg-slate-900/20 rounded-3xl border border-slate-900 p-8 sm:p-10 space-y-6 text-left">
        <div className="flex items-center space-x-2.5 text-primary-400">
          <Heart className="w-5 h-5 fill-current" />
          <h2 className="text-lg font-bold uppercase tracking-wide">My Teaching Philosophy</h2>
        </div>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          I believe that no student is bad at physics. Physics is simply the translation of natural phenomena into mathematical logic. When you build the bridge of physical intuition first, the mathematical representations follow naturally.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {[
            'Concept-first learning loops',
            'Real-world physical applications',
            'Step-by-step problem sets',
            'Constant assessment and feedback loops'
          ].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-primary-400 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutTeacher;
