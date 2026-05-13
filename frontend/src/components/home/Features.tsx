'use client';

import { Brain, Zap, BarChart3, Users, BookOpen, Clock } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Smart College Predictor',
    description: 'AI-powered predictions based on your rank, category & state',
  },
  {
    icon: Zap,
    title: 'Real-Time Alerts',
    description: 'Never miss important counseling dates & registration updates',
  },
  {
    icon: BarChart3,
    title: 'Cut-off Database',
    description: '4 years of cut-off data for all colleges & quotas',
  },
  {
    icon: BookOpen,
    title: 'Mock Tests & Papers',
    description: 'Practice with full-length tests & previous year papers',
  },
  {
    icon: Users,
    title: 'Expert Forum',
    description: 'Ask questions & get answers from medical professionals',
  },
  {
    icon: Clock,
    title: 'Study Materials',
    description: 'Download guides, checklists & preparation resources',
  },
];

export default function Features() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">✨ Why Choose Us?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                <Icon className="text-blue-600 mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
