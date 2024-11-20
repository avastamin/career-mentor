import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FileText, Eye, Loader, Sparkles } from 'lucide-react';
import { useCareerAnalysis } from '../../../contexts/CareerAnalysisContext';
import { CareerAnalysisPrompt } from '../CareerAnalysisPrompt';
import { ResumeEditor } from './ResumeEditor';
import { ResumePreview } from './ResumePreview';
import { ResumeTemplates } from './ResumeTemplates';
import { AnimatedButton } from '../../AnimatedButton';
import { AnimatedCard } from '../../AnimatedCard';
import { generateResume, type ResumeData } from '../../../lib/ai/resume';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const STORAGE_KEYS = {
  RESUME_DATA: 'resumeBuilderData',
  TEMPLATE: 'resumeTemplate',
  GENERATED: 'resumeGenerated'
};

export const ResumeBuilderPage = () => {
  const { analysisResults, userProfile } = useCareerAnalysis();
  const [activeTemplate, setActiveTemplate] = useState(() => 
    sessionStorage.getItem(STORAGE_KEYS.TEMPLATE) || 'modern'
  );
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportingPdf, setExportingPdf] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const savedData = sessionStorage.getItem(STORAGE_KEYS.RESUME_DATA);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        location: '',
        title: userProfile?.currentRole || '',
        summary: ''
      },
      experience: [],
      education: [],
      skills: userProfile?.skills || [],
      links: []
    };
  });

  // Check if initial generation is needed
  useEffect(() => {
    const hasGenerated = sessionStorage.getItem(STORAGE_KEYS.GENERATED) === 'true';
    if (analysisResults && userProfile && !hasGenerated && !resumeData.experience.length) {
      generateInitialResume();
    }
  }, [analysisResults, userProfile]);

  // Save resume data and template to sessionStorage when they change
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.RESUME_DATA, JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.TEMPLATE, activeTemplate);
  }, [activeTemplate]);

  const generateInitialResume = async () => {
    if (!userProfile || loading) return;

    try {
      setLoading(true);
      setError(null);

      const generatedResume = await generateResume(userProfile, activeTemplate);
      setResumeData(prevData => ({
        ...generatedResume,
        personalInfo: {
          ...generatedResume.personalInfo,
          name: prevData.personalInfo.name,
          email: prevData.personalInfo.email,
          phone: prevData.personalInfo.phone,
          location: prevData.personalInfo.location
        }
      }));

      // Mark as generated
      sessionStorage.setItem(STORAGE_KEYS.GENERATED, 'true');
    } catch (err) {
      console.error('Error generating resume:', err);
      setError('Failed to generate resume content');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!userProfile || loading) return;

    try {
      setLoading(true);
      setError(null);

      // Save current personal info
      const currentPersonalInfo = { ...resumeData.personalInfo };

      const generatedResume = await generateResume(userProfile, activeTemplate);
      
      // Merge new content with existing personal info
      setResumeData({
        ...generatedResume,
        personalInfo: {
          ...generatedResume.personalInfo,
          name: currentPersonalInfo.name,
          email: currentPersonalInfo.email,
          phone: currentPersonalInfo.phone,
          location: currentPersonalInfo.location
        }
      });

      sessionStorage.setItem(STORAGE_KEYS.GENERATED, 'true');
    } catch (err) {
      console.error('Error regenerating resume:', err);
      setError('Failed to regenerate resume content');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (template: string) => {
    setActiveTemplate(template);
  };

  const handleExportPDF = async () => {
    if (!previewRef.current || exportingPdf) return;

    try {
      setExportingPdf(true);
      setError(null);

      // Set temporary styles for better PDF quality
      const originalStyle = previewRef.current.style.cssText;
      previewRef.current.style.width = '1024px';
      previewRef.current.style.margin = '0';
      previewRef.current.style.padding = '0';

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Restore original styles
      previewRef.current.style.cssText = originalStyle;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`resume-${activeTemplate}-${new Date().toISOString()}.pdf`);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      setError('Failed to export PDF. Please try again.');
    } finally {
      setExportingPdf(false);
    }
  };

  const handleUpdateResume = (newData: ResumeData) => {
    setResumeData(newData);
    sessionStorage.setItem(STORAGE_KEYS.RESUME_DATA, JSON.stringify(newData));
  };

  if (!analysisResults || !userProfile) {
    return <CareerAnalysisPrompt />;
  }

  return (
    <>
      <Helmet>
        <title>Resume Builder - CareerMentor</title>
        <meta 
          name="description" 
          content="Create and customize your professional resume with our AI-powered resume builder." 
        />
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
              <p className="text-gray-600">Create and customize your professional resume</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatedButton
                variant="secondary"
                onClick={handleRegenerate}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 border-0"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                    <span>Generate New</span>
                  </>
                )}
              </AnimatedButton>
            </motion.div>

            <AnimatedButton
              variant="secondary"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center gap-2"
            >
              {isPreviewMode ? (
                <>
                  Edit Resume
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Preview
                </>
              )}
            </AnimatedButton>
            
            {isPreviewMode && (
              <AnimatedButton
                variant="primary"
                onClick={handleExportPDF}
                className="flex items-center gap-2"
                disabled={exportingPdf}
              >
                {exportingPdf ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Export PDF
                  </>
                )}
              </AnimatedButton>
            )}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600"
          >
            {error}
          </motion.div>
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-600 flex items-center gap-3"
          >
            <Loader className="w-5 h-5 animate-spin" />
            <span>Generating resume content...</span>
          </motion.div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {!isPreviewMode ? (
            <>
              <div className="col-span-3">
                <ResumeTemplates
                  activeTemplate={activeTemplate}
                  onSelectTemplate={handleTemplateChange}
                />
              </div>
              <div className="col-span-9">
                <ResumeEditor
                  resumeData={resumeData}
                  onUpdateResume={handleUpdateResume}
                  careerAnalysis={analysisResults}
                  template={activeTemplate}
                />
              </div>
            </>
          ) : (
            <div className="col-span-12">
              <AnimatedCard>
                <div ref={previewRef}>
                  <ResumePreview
                    resumeData={resumeData}
                    template={activeTemplate}
                  />
                </div>
              </AnimatedCard>
            </div>
          )}
        </div>
      </div>
    </>
  );
};