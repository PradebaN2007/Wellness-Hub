import React, { useState } from "react";
import { Search, BookOpen, Wind, Video, FileText, ChevronRight } from "lucide-react";

const WellnessResources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const resources = [
    {
      id: 1,
      type: "Article",
      icon: FileText,
      title: "Understanding Workplace Stress",
      description:
        "Learn about common workplace stressors and effective coping strategies to maintain mental wellness.",
      duration: "5 min read",
      category: "Mental Health",
      color: "from-blue-400 to-indigo-500",
      bgColor: "from-blue-50 to-indigo-50",
      url: "https://www.helpguide.org/articles/stress/stress-at-work.htm",
    },
    {
      id: 2,
      type: "Meditation",
      icon: Wind,
      title: "Guided Breathing Exercise",
      description:
        "A calming 10-minute breathing technique to reduce anxiety and improve focus throughout your day.",
      duration: "10 min",
      category: "Mindfulness",
      color: "from-emerald-400 to-green-500",
      bgColor: "from-emerald-50 to-green-50",
      url: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
    },
    {
      id: 3,
      type: "Video",
      icon: Video,
      title: "Preventing Burnout at Work",
      description:
        "Expert insights on recognizing burnout signs early and implementing preventive measures.",
      duration: "15 min",
      category: "Wellbeing",
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      url: "https://www.youtube.com/watch?v=jqONINYF17M",
    },
    {
      id: 4,
      type: "Article",
      icon: BookOpen,
      title: "Building Resilience",
      description:
        "Discover practical techniques to build emotional resilience and bounce back from challenges.",
      duration: "7 min read",
      category: "Growth",
      color: "from-orange-400 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      url: "https://www.apa.org/topics/resilience/building-your-resilience",
    },
    {
      id: 5,
      type: "Meditation",
      icon: Wind,
      title: "Mindful Body Scan",
      description:
        "Progressive relaxation technique to release tension and promote deep relaxation.",
      duration: "12 min",
      category: "Mindfulness",
      color: "from-teal-400 to-cyan-500",
      bgColor: "from-teal-50 to-cyan-50",
      url: "https://www.youtube.com/watch?v=QS2yDmWk0vs",
    },
    {
      id: 6,
      type: "Video",
      icon: Video,
      title: "Work-Life Balance Tips",
      description:
        "Practical strategies to create healthy boundaries between work and personal life.",
      duration: "20 min",
      category: "Balance",
      color: "from-yellow-400 to-amber-500",
      bgColor: "from-yellow-50 to-amber-50",
      url: "https://www.youtube.com/watch?v=8-bmWgii5Oc",
    },
  ];

  const categories = [
    "All",
    "Mental Health",
    "Mindfulness",
    "Wellbeing",
    "Growth",
    "Balance",
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      resource.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleResourceClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
          Wellness Resources 📚
        </h1>
        <p className="text-slate-600 text-lg">
          Explore curated content to support your mental health journey
        </p>
      </div>

      {/* Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/60">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for articles, videos, meditation guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
              selectedCategory === category
                ? "bg-gradient-to-r from-emerald-400 to-blue-500 text-white shadow-lg scale-105"
                : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const Icon = resource.icon;
          return (
            <div
              key={resource.id}
              onClick={() => handleResourceClick(resource.url)}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-200/60 cursor-pointer"
            >
              <div
                className={`bg-gradient-to-br ${resource.bgColor} p-6 border-b border-slate-100`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`bg-gradient-to-br ${resource.color} rounded-xl p-3 shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <span className="bg-white/80 px-3 py-1 rounded-full text-xs font-semibold text-slate-700">
                    {resource.type}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </h3>
              </div>

              <div className="p-6">
                <p className="text-slate-600 mb-4">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-500">
                      {resource.duration}
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-sm font-semibold text-emerald-600">
                      {resource.category}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResourceClick(resource.url);
                    }}
                    className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:gap-2 transition-all duration-300"
                  >
                    View
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WellnessResources;
