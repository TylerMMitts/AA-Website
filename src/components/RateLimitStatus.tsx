import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, Zap, FileText } from 'lucide-react';
import { peekRateLimit, getRateLimitKey, RATE_LIMITS } from '../utils/rateLimiter';

interface RateLimitStatusProps {
  userId: string;
  isPro: boolean;
}

export function RateLimitStatus({ userId, isPro }: RateLimitStatusProps) {
  const [jobSearchLimit, setJobSearchLimit] = useState({ remaining: 0, total: 0, resetTime: 0 });
  const [resumeLimit, setResumeLimit] = useState({ remaining: 0, total: 0, resetTime: 0 });
  const [coverLetterLimit, setCoverLetterLimit] = useState({ remaining: 0, total: 0, resetTime: 0 });

  useEffect(() => {
    if (!userId) return;

    const updateLimits = () => {
      // Job Search Limit - use peek to avoid consuming requests
      const jobSearchKey = getRateLimitKey(userId, 'job-search');
      const jobSearchConfig = isPro ? RATE_LIMITS.JOB_SEARCH_PRO : RATE_LIMITS.JOB_SEARCH_FREE;
      const jobSearchResult = peekRateLimit(jobSearchKey, jobSearchConfig);
      
      setJobSearchLimit({
        remaining: jobSearchResult.remaining,
        total: jobSearchConfig.maxRequests,
        resetTime: jobSearchResult.resetTime,
      });

      // Resume Generation Limit (Pro only) - use peek to avoid consuming requests
      if (isPro) {
        const resumeKey = getRateLimitKey(userId, 'document-generation-resume');
        const resumeConfig = RATE_LIMITS.DOCUMENT_GENERATION_RESUME;
        const resumeResult = peekRateLimit(resumeKey, resumeConfig);
        
        setResumeLimit({
          remaining: resumeResult.remaining,
          total: resumeConfig.maxRequests,
          resetTime: resumeResult.resetTime,
        });

        // Cover Letter Generation Limit (Pro only) - use peek to avoid consuming requests
        const coverLetterKey = getRateLimitKey(userId, 'document-generation-cover-letter');
        const coverLetterConfig = RATE_LIMITS.DOCUMENT_GENERATION_COVER_LETTER;
        const coverLetterResult = peekRateLimit(coverLetterKey, coverLetterConfig);
        
        setCoverLetterLimit({
          remaining: coverLetterResult.remaining,
          total: coverLetterConfig.maxRequests,
          resetTime: coverLetterResult.resetTime,
        });
      }
    };

    updateLimits();
    // Update every minute
    const interval = setInterval(updateLimits, 60000);
    return () => clearInterval(interval);
  }, [userId, isPro]);

  const formatResetTime = (resetTime: number) => {
    const now = Date.now();
    if (resetTime <= now) return 'Now';
    
    const diffMs = resetTime - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) return `${diffHours}h ${diffMins % 60}m`;
    return `${diffMins}m`;
  };

  if (!userId) return null;

  return (
    <Card className="rounded-xl border-2" style={{ borderColor: '#51355A', backgroundColor: 'white' }}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5" style={{ color: '#9E2B25' }} />
          <h3 className="font-semibold text-lg" style={{ color: '#2A0C4E' }}>API Usage</h3>
        </div>
        
        <div className="space-y-3">
          {/* Job Search Limit */}
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FFF8F0' }}>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" style={{ color: '#51355A' }} />
              <span className="text-sm font-medium" style={{ color: '#51355A' }}>Job Searches</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className="rounded-full"
                style={{ 
                  borderColor: jobSearchLimit.remaining > 3 ? '#51355A' : '#9E2B25',
                  color: jobSearchLimit.remaining > 3 ? '#51355A' : '#9E2B25'
                }}
              >
                {jobSearchLimit.remaining}/{jobSearchLimit.total}
              </Badge>
              <span className="text-xs" style={{ color: '#51355A', opacity: 0.7 }}>
                Resets in {formatResetTime(jobSearchLimit.resetTime)}
              </span>
            </div>
          </div>

          {/* Resume Generation Limit (Pro only) */}
          {isPro && (
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FFF8F0' }}>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" style={{ color: '#51355A' }} />
                <span className="text-sm font-medium" style={{ color: '#51355A' }}>Resume</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className="rounded-full"
                  style={{ 
                    borderColor: resumeLimit.remaining > 0 ? '#51355A' : '#9E2B25',
                    color: resumeLimit.remaining > 0 ? '#51355A' : '#9E2B25'
                  }}
                >
                  {resumeLimit.remaining}/{resumeLimit.total}
                </Badge>
                <span className="text-xs" style={{ color: '#51355A', opacity: 0.7 }}>
                  Resets in {formatResetTime(resumeLimit.resetTime)}
                </span>
              </div>
            </div>
          )}

          {/* Cover Letter Generation Limit (Pro only) */}
          {isPro && (
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FFF8F0' }}>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" style={{ color: '#51355A' }} />
                <span className="text-sm font-medium" style={{ color: '#51355A' }}>Cover Letter</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className="rounded-full"
                  style={{ 
                    borderColor: coverLetterLimit.remaining > 0 ? '#51355A' : '#9E2B25',
                    color: coverLetterLimit.remaining > 0 ? '#51355A' : '#9E2B25'
                  }}
                >
                  {coverLetterLimit.remaining}/{coverLetterLimit.total}
                </Badge>
                <span className="text-xs" style={{ color: '#51355A', opacity: 0.7 }}>
                  Resets in {formatResetTime(coverLetterLimit.resetTime)}
                </span>
              </div>
            </div>
          )}

          {!isPro && (
            <p className="text-xs text-center pt-2" style={{ color: '#51355A', opacity: 0.7 }}>
              Upgrade to Pro for more searches and document generation
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
