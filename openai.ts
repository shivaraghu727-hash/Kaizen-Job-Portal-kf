export interface CareerMatch {
  career: string
  reason: string
}

export interface PersonalityTrait {
  score: number
  summary: string
}

export interface PersonalityProfile {
  Openness: PersonalityTrait
  Conscientiousness: PersonalityTrait
  Extraversion: PersonalityTrait
  Agreeableness: PersonalityTrait
  Neuroticism: PersonalityTrait
}

export interface WorkStyle {
  working_style: string
  preferred_environment: string
  learning_approach: string
  risk_attitude: string
  stress_response: string
  independence_vs_collaboration: string
}

export interface CareerAnalysis {
  careers: CareerMatch[]
  personality_profile: PersonalityProfile
  work_style: WorkStyle
}

export interface JobFitAnalysis {
  fitment_score: number
  analysis: string
  strengths: string[]
  areas_for_growth: string[]
}

// Mock AI analysis functions that work without API calls
export async function analyzeCareerFit(studentData: any): Promise<CareerAnalysis> {
  console.log("Analyzing career fit with mock AI...")

  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock personality analysis based on answers
  const personalityProfile: PersonalityProfile = {
    Openness: {
      score: 4,
      summary: "You're curious and enjoy exploring new ideas and creative solutions.",
    },
    Conscientiousness: {
      score: 4,
      summary: "You're organized, reliable, and like to plan ahead.",
    },
    Extraversion: {
      score: 3,
      summary: "You enjoy social interactions but also value quiet time.",
    },
    Agreeableness: {
      score: 4,
      summary: "You're helpful, considerate, and work well with others.",
    },
    Neuroticism: {
      score: 2,
      summary: "You tend to stay calm and composed under pressure.",
    },
  }

  const workStyle: WorkStyle = {
    working_style: "Collaborative problem-solver with attention to detail",
    preferred_environment: "Team-based with flexibility for independent work",
    learning_approach: "Hands-on learning with structured guidance",
    risk_attitude: "Calculated risk-taker who evaluates options carefully",
    stress_response: "Stays calm under pressure and seeks solutions",
    independence_vs_collaboration: "Enjoys both teamwork and independent contributions",
  }

  const careers: CareerMatch[] = [
    {
      career: "Software Developer",
      reason: "Strong technical background and problem-solving skills match your analytical nature",
    },
    {
      career: "Product Manager",
      reason: "Leadership potential and strategic thinking align with your organizational skills",
    },
    {
      career: "Data Analyst",
      reason: "Analytical mindset and attention to detail suit data-driven roles",
    },
  ]

  return {
    careers,
    personality_profile: personalityProfile,
    work_style: workStyle,
  }
}

export async function analyzeJobFit(studentData: any, jobData: any): Promise<JobFitAnalysis> {
  console.log("Analyzing job fit with mock AI...")

  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock job fit analysis
  const fitmentScore = Math.floor(Math.random() * 20) + 75 // 75-95% range

  return {
    fitment_score: fitmentScore,
    analysis: `Based on your assessment, you show strong alignment with this ${jobData.jobType} role. Your technical background and problem-solving approach match well with the requirements.`,
    strengths: [
      "Technical aptitude matches job requirements",
      "Problem-solving skills align with role needs",
      "Communication style fits team environment",
    ],
    areas_for_growth: [
      "Consider developing specific skills mentioned in job description",
      "Gain more experience in the industry domain",
    ],
  }
}
