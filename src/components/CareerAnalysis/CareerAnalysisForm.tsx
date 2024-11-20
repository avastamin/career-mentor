// ... imports remain the same

// In CareerAnalysisForm.tsx
useEffect(() => {
  let mounted = true;
  let subscription: RealtimeSubscription | null = null;

  const loadRemainingAnalyses = async () => {
    if (!user) {
      setRemainingAnalyses(null);
      return;
    }

    try {
      const remaining = await getRemainingAnalyses(user.id);
      if (mounted) {
        setRemainingAnalyses(remaining);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading remaining analyses:', error);
      if (mounted) {
        setRemainingAnalyses(0);
        setLoading(false);
      }
    }
  };

  // Set up real-time subscription for user profile changes
  if (user) {
    subscription = supabase
      .channel(`user-profile-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'career_analyses',
          filter: `user_id=eq.${user.id}`
        },
        async () => {
          console.log('Analysis change detected, reloading credits');
          await loadRemainingAnalyses();
        }
      )
      .subscribe();

    // Also subscribe to profile changes
    supabase
      .channel(`profile-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${user.id}`
        },
        async () => {
          console.log('Profile change detected, reloading credits');
          await loadRemainingAnalyses();
        }
      )
      .subscribe();
  }

  // Initial load
  loadRemainingAnalyses();

  return () => {
    mounted = false;
    if (subscription) {
      subscription.unsubscribe();
    }
  };
}, [user]);



const onSubmit = async (data: CareerProfile) => {
  if (!user) {
    setError('Please sign in to perform career analysis');
    return;
  }

  if (loading) return;

  try {
    setLoading(true);
    setError(null);

    // Check if user can create analysis
    const canCreate = await canCreateAnalysis(user.id);

    if (!canCreate) {
      setError(
        'You have reached your analysis limit. Please upgrade your plan to create more analyses.'
      );
      return;
    }

    // Transform string inputs to arrays
    const transformedData = {
      ...data,
      skills: data.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      interests: data.interests
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    console.log('Starting analysis with data:', transformedData);

    // Perform AI analysis
    const result = await analyzeCareer(
      transformedData,
      userProfile?.role || 'free'
    );

    if (!result) {
      throw new Error('Failed to generate analysis results');
    }

    console.log('Analysis results:', result);

    // Save analysis to database
    await saveCareerAnalysis(user.id, transformedData, result);

    // Update remaining analyses count
    const remaining = await getRemainingAnalyses(user.id);
    setRemainingAnalyses(remaining);

    // Update global state
    setGlobalAnalysisResults(result);
    setUserProfile(transformedData);

    // Store results in session storage as backup
    sessionStorage.setItem('latestAnalysis', JSON.stringify(result));
    sessionStorage.setItem('latestProfile', JSON.stringify(transformedData));

    // Navigate to overview page with results
    navigate('/dashboard/overview', {
      replace: true,
      state: { analysisResults: result, userProfile: transformedData },
    });

    console.log('Analysis completed and saved successfully');
  } catch (error) {
    console.error('Analysis error:', error);
    setError(
      error instanceof Error
        ? error.message
        : 'Failed to analyze career data'
    );
  } finally {
    setLoading(false);
  }
};