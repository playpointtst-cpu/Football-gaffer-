import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import {
  MessageSquare,
  Heart,
  Repeat2,
  Share2,
  TrendingUp,
  Award,
  Mic,
  Camera,
  CheckCircle2,
  Shield,
  Search,
  Filter,
  Sparkles,
  Flame,
  AlertCircle,
  Clock,
  Send,
  Building,
  Users,
} from 'lucide-react';
import { SocialPost } from '../../types/game';
import { PressConferenceModal } from '../press/PressConferenceModal';

export const MediaAndSocialView: React.FC = () => {
  const {
    state,
    likeSocialPost,
    replyToSocialPost,
    triggerEmergencyPressConference,
  } = useGame();

  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'press' | 'history'>('feed');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPressModalOpen, setIsPressModalOpen] = useState(false);

  // Replying state for individual post
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyInputText, setReplyInputText] = useState('');

  // Filtered social posts
  const filteredPosts = useMemo(() => {
    return (state.socialFeed || []).filter(post => {
      const matchesSearch =
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesRole = true;
      if (roleFilter === 'Players') matchesRole = post.authorRole === 'Player';
      else if (roleFilter === 'Journalists') matchesRole = post.authorRole === 'Journalist' || post.authorRole === 'Pundit';
      else if (roleFilter === 'Fans') matchesRole = post.authorRole === 'Fan';
      else if (roleFilter === 'Official') matchesRole = post.authorRole === 'Club Official';

      return matchesSearch && matchesRole;
    });
  }, [state.socialFeed, searchQuery, roleFilter]);

  const handleSendReply = (postId: string) => {
    if (!replyInputText.trim()) return;
    replyToSocialPost(postId, replyInputText.trim());
    setReplyInputText('');
    setActiveReplyPostId(null);
  };

  const handlePredefinedReply = (postId: string, text: string) => {
    replyToSocialPost(postId, text);
    setActiveReplyPostId(null);
  };

  const sentimentStyles = (sentiment: SocialPost['sentiment']) => {
    switch (sentiment) {
      case 'ecstatic':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30';
      case 'positive':
        return 'text-sky-400 bg-sky-950/60 border-sky-500/30';
      case 'neutral':
        return 'text-slate-400 bg-slate-900 border-slate-700';
      case 'critical':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/30';
      case 'furious':
        return 'text-rose-400 bg-rose-950/60 border-rose-500/30';
    }
  };

  const roleBadge = (role: SocialPost['authorRole']) => {
    switch (role) {
      case 'Player':
        return <span className="text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">Squad Player</span>;
      case 'Journalist':
        return <span className="text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">Journalist</span>;
      case 'Pundit':
        return <span className="text-[10px] font-bold uppercase bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded">Pundit</span>;
      case 'Fan':
        return <span className="text-[10px] font-bold uppercase bg-purple-500/15 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded">Supporter</span>;
      case 'Club Official':
        return <span className="text-[10px] font-bold uppercase bg-sky-500/15 text-sky-400 border border-sky-500/30 px-1.5 py-0.5 rounded">Official Club</span>;
    }
  };

  // Trending hashtag metrics
  const trendingTags = [
    { tag: `#${state.selectedClub.name.replace(/\s+/g, '')}`, count: '48.2K posts' },
    { tag: '#PremierChampionship', count: '32.1K posts' },
    { tag: '#NavarroBall', count: '19.4K posts' },
    { tag: '#Transfers', count: '14.8K posts' },
    { tag: '#YouthAcademy', count: '9.2K posts' },
  ];

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              Public Relations & Social Sentiment
            </span>
            {state.activePressConference && !state.activePressConference.isCompleted && (
              <span className="text-xs font-bold font-mono text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded animate-pulse">
                Media Room Awaiting Executive
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Press Room & FanZone Feed
          </h1>
          <p className="text-xs text-slate-400">
            Monitor player social reaction, journalist scrutiny, and supporter sentiment dynamically tied to match performance.
          </p>
        </div>

        {/* Action Button: Emergency Press Conference or Active Briefing */}
        <div className="flex items-center gap-3 shrink-0">
          {state.activePressConference && !state.activePressConference.isCompleted ? (
            <button
              onClick={() => setIsPressModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/50 transition-colors animate-bounce"
            >
              <Mic className="w-4 h-4" />
              <span>Enter Active Press Conference</span>
            </button>
          ) : (
            <button
              onClick={() => triggerEmergencyPressConference('Tactical Direction & Squad Form')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Call Executive Press Briefing</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('feed')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
            activeSubTab === 'feed'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Social Feed ({filteredPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('press')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 relative ${
            activeSubTab === 'press'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Press Room</span>
          {state.activePressConference && !state.activePressConference.isCompleted && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
            activeSubTab === 'history'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Media Archive ({state.pressHistory?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: SOCIAL FEED */}
      {activeSubTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Feed Column */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Role filter chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar text-xs">
                {['All', 'Players', 'Journalists', 'Fans', 'Official'].map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-lg shrink-0 font-semibold transition-colors ${
                      roleFilter === role
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* Search box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tweets, names, tags..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Posts List */}
            {filteredPosts.length === 0 ? (
              <div className="bg-[#111827] border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
                No social posts found matching current filters.
              </div>
            ) : (
              filteredPosts.map(post => (
                <div
                  key={post.id}
                  className="bg-[#111827] border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 space-y-3 transition-colors shadow-sm"
                >
                  {/* Author Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white hover:underline cursor-pointer">
                            {post.authorName}
                          </span>
                          {post.verified && (
                            <span className="text-sky-400 text-xs" title="Verified Account">
                              ✓
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-mono">
                            {post.authorHandle}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {roleBadge(post.authorRole)}
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" /> {post.timeAgo}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sentiment & Match Pill */}
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${sentimentStyles(post.sentiment)}`}>
                        {post.sentiment}
                      </span>
                      {post.matchContext && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          vs {post.matchContext.opponent} ({post.matchContext.score})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line pl-1">
                    {post.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[11px] text-sky-400 hover:underline cursor-pointer font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Manager Reply Display */}
                  {post.managerReply && (
                    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-lg p-3 space-y-1">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-400">
                        <Shield className="w-3.5 h-3.5" />
                        Official Club Executive Statement ({state.managerProfile?.fullName || 'Chief Executive'})
                      </div>
                      <p className="text-xs text-slate-200 italic pl-2 border-l-2 border-emerald-500">
                        "{post.managerReply}"
                      </p>
                    </div>
                  )}

                  {/* Action Bar (Like, Repost, Reply) */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                    <div className="flex items-center gap-6">
                      {/* Like button */}
                      <button
                        type="button"
                        onClick={() => likeSocialPost(post.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          post.likedByManager ? 'text-rose-400 font-bold' : 'hover:text-rose-400'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.likedByManager ? 'fill-current' : ''}`} />
                        <span>{post.likes.toLocaleString()}</span>
                      </button>

                      {/* Repost count */}
                      <div className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer">
                        <Repeat2 className="w-4 h-4" />
                        <span>{post.reposts.toLocaleString()}</span>
                      </div>

                      {/* Comments count */}
                      <button
                        type="button"
                        onClick={() => setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)}
                        className="flex items-center gap-1.5 hover:text-sky-400 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentsCount.toLocaleString()}</span>
                      </button>
                    </div>

                    {/* Official Statement Trigger */}
                    {!post.managerReply && (
                      <button
                        type="button"
                        onClick={() => setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)}
                        className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        {activeReplyPostId === post.id ? 'Cancel Reply' : '+ Issue Executive Reply'}
                      </button>
                    )}
                  </div>

                  {/* Interactive Reply Input Drawer */}
                  {activeReplyPostId === post.id && (
                    <div className="pt-3 border-t border-slate-800/80 space-y-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Issue Official Clarification / Response
                      </div>

                      {/* Quick preset chips */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handlePredefinedReply(post.id, 'We hear our supporters loud and clear. Work is already underway behind closed doors.')}
                          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-750 text-[11px] text-slate-300 transition-colors"
                        >
                          "We hear our supporters..."
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePredefinedReply(post.id, 'Proud of the fighting spirit shown today. We stay united as one club.')}
                          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-750 text-[11px] text-slate-300 transition-colors"
                        >
                          "Proud of the fighting spirit..."
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePredefinedReply(post.id, 'Our focus shifts immediately to Monday training. Standards will be upheld.')}
                          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-750 text-[11px] text-slate-300 transition-colors"
                        >
                          "Focus shifts to training..."
                        </button>
                      </div>

                      {/* Custom input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={replyInputText}
                          onChange={e => setReplyInputText(e.target.value)}
                          placeholder="Type executive statement..."
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendReply(post.id)}
                          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Publish</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>

          {/* Sidebar Column: Trending Topics & Media Barometer */}
          <div className="space-y-4">
            
            {/* Supporter Sentiment Barometer */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Public Sentiment Index
              </span>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Supporter Approval</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {state.selectedClub.boardMandate.fanTrustRating}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${state.selectedClub.boardMandate.fanTrustRating}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Board Stability</span>
                <span className="font-mono text-sky-400 font-bold">
                  {state.selectedClub.boardMandate.boardConfidence}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${state.selectedClub.boardMandate.boardConfidence}%` }}
                />
              </div>
            </div>

            {/* Trending Hashtags */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Trending in Football
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Live</span>
              </div>

              <div className="space-y-2.5 divide-y divide-slate-800/80">
                {trendingTags.map((trend, idx) => (
                  <div key={trend.tag} className="pt-2 first:pt-0 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white hover:text-emerald-400 cursor-pointer">
                        {trend.tag}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{trend.count}</div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Media Guide */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Executive Communications Protocol
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Public comments directly influence player contract morale and fan ticket compliance. Protecting the Head Coach increases job security but may frustrate critical journalists.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: PRESS ROOM */}
      {activeSubTab === 'press' && (
        <div className="space-y-6">
          {state.activePressConference ? (
            <div className="bg-gradient-to-r from-slate-900 via-[#111a30] to-slate-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Mic className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                      {state.activePressConference.triggerEvent} Briefing
                    </span>
                    <h2 className="text-lg font-bold text-white mt-1">
                      {state.activePressConference.headline}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Accredited journalists are waiting in the media suite. {state.activePressConference.questions.length} questions prepared.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPressModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take the Podium & Answer Press</span>
                </button>
              </div>

              {/* Questions Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
                {state.activePressConference.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-amber-400 font-bold">{q.outlet}</span>
                      <span className="text-slate-500">Q{idx + 1}</span>
                    </div>
                    <div className="text-slate-300 font-medium truncate">
                      {q.topic}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      "{q.question}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#111827] border border-slate-800 rounded-2xl p-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                <Mic className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Media Suite Currently Clear</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Post-match press conferences trigger automatically following each simulated gameweek fixture. You can also call an executive briefing immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerEmergencyPressConference('Club Financial Sustainability & Football Mandate');
                  setIsPressModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Call Emergency Media Briefing</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MEDIA ARCHIVE */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          {(!state.pressHistory || state.pressHistory.length === 0) ? (
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
              No completed press conferences in the archive yet. Complete a post-match media room to build your public record.
            </div>
          ) : (
            state.pressHistory.map((item, idx) => (
              <div
                key={`${item.conferenceId}_${idx}`}
                className="bg-[#111827] border border-slate-800 rounded-xl p-5 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                        Week {item.week} • {item.triggerEvent}
                      </span>
                      <span className="text-xs text-slate-500">{item.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      {item.headline}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className={`px-2 py-0.5 rounded ${item.totalMoraleDelta >= 0 ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'}`}>
                      Morale: {item.totalMoraleDelta >= 0 ? '+' : ''}{item.totalMoraleDelta}%
                    </span>
                    <span className={`px-2 py-0.5 rounded ${item.totalFanTrustDelta >= 0 ? 'text-emerald-400 bg-emerald-950/60' : 'text-rose-400 bg-rose-950/60'}`}>
                      Fans: {item.totalFanTrustDelta >= 0 ? '+' : ''}{item.totalFanTrustDelta}%
                    </span>
                  </div>
                </div>

                {/* Key Quote */}
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 italic">
                  Key Executive Quote: "{item.keyQuote}"
                </div>

                {/* Published Headlines */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Published Headlines
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {item.outletHeadlines.map((headline, hIdx) => (
                      <div key={hIdx} className="text-slate-300 truncate">
                        • {headline}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Press Conference Modal */}
      <PressConferenceModal
        isOpen={isPressModalOpen}
        onClose={() => setIsPressModalOpen(false)}
      />

    </div>
  );
};
