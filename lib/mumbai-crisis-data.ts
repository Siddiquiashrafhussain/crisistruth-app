// Mumbai Crisis-Specific Data and Templates

export const MUMBAI_CRISIS_TEMPLATES = {
  monsoon: {
    title: 'Mumbai Monsoon 2025',
    description: 'Real-time verification of monsoon-related claims and alerts',
    location: 'Mumbai, Maharashtra',
    priority: 'high' as const,
    commonClaims: [
      'Sea Link is closed due to flooding',
      'Local trains stopped on Western Line',
      'Bridge collapsed in Andheri',
      'Water level rising in low-lying areas',
      'Schools declared holiday tomorrow',
      'Airport operations suspended',
      'Power outage in South Mumbai',
      'Rescue operations underway in Kurla',
    ],
  },
  flooding: {
    title: 'Urban Flooding Alert',
    description: 'Tracking waterlogging and flood-related misinformation',
    location: 'Mumbai Metropolitan Region',
    priority: 'high' as const,
    commonClaims: [
      'Waterlogging at Sion-Panvel highway',
      'Mithi river overflowing',
      'Evacuation ordered in coastal areas',
      'BMC helpline numbers changed',
      'Relief camps opened in schools',
    ],
  },
  transport: {
    title: 'Transport Disruption',
    description: 'Verifying claims about transport and mobility',
    location: 'Mumbai',
    priority: 'medium' as const,
    commonClaims: [
      'All local trains cancelled',
      'Metro services suspended',
      'BEST buses not operating',
      'Taxi services unavailable',
      'Highway closed for traffic',
    ],
  },
}

export const TRUSTED_MUMBAI_SOURCES = [
  {
    title: 'Mumbai Traffic Police',
    url: 'https://traffic.mumbaipolice.gov.in',
    type: 'government' as const,
    credibility: 98,
    apiEndpoint: '/api/traffic-updates',
  },
  {
    title: 'BMC Official',
    url: 'https://portal.mcgm.gov.in',
    type: 'government' as const,
    credibility: 98,
    apiEndpoint: '/api/civic-updates',
  },
  {
    title: 'Central Railway',
    url: 'https://cr.indianrailways.gov.in',
    type: 'government' as const,
    credibility: 97,
    apiEndpoint: '/api/train-status',
  },
  {
    title: 'Western Railway',
    url: 'https://wr.indianrailways.gov.in',
    type: 'government' as const,
    credibility: 97,
    apiEndpoint: '/api/train-status',
  },
  {
    title: 'Mumbai Metro',
    url: 'https://www.mmrcl.com',
    type: 'government' as const,
    credibility: 96,
    apiEndpoint: '/api/metro-status',
  },
  {
    title: 'IMD Mumbai',
    url: 'https://www.imd.gov.in',
    type: 'government' as const,
    credibility: 99,
    apiEndpoint: '/api/weather-alerts',
  },
  {
    title: 'Mumbai Police',
    url: 'https://mumbaipolice.gov.in',
    type: 'government' as const,
    credibility: 98,
    apiEndpoint: '/api/emergency-alerts',
  },
  {
    title: 'Times of India Mumbai',
    url: 'https://timesofindia.indiatimes.com/city/mumbai',
    type: 'news' as const,
    credibility: 85,
  },
  {
    title: 'Mumbai Mirror',
    url: 'https://mumbaimirror.indiatimes.com',
    type: 'news' as const,
    credibility: 82,
  },
  {
    title: 'Hindustan Times Mumbai',
    url: 'https://www.hindustantimes.com/cities/mumbai-news',
    type: 'news' as const,
    credibility: 84,
  },
]

export const MUMBAI_LOCATIONS = [
  'Andheri',
  'Bandra',
  'Borivali',
  'Churchgate',
  'Colaba',
  'Dadar',
  'Ghatkopar',
  'Juhu',
  'Kurla',
  'Lower Parel',
  'Malad',
  'Marine Drive',
  'Powai',
  'Sion',
  'Thane',
  'Vashi',
  'Vikhroli',
  'Worli',
]

export const CRISIS_KEYWORDS = {
  transport: ['train', 'metro', 'bus', 'taxi', 'traffic', 'road', 'highway', 'bridge', 'sea link'],
  flooding: ['flood', 'waterlogging', 'water level', 'overflow', 'submerged', 'inundated'],
  weather: ['rain', 'monsoon', 'cyclone', 'storm', 'wind', 'weather', 'alert'],
  emergency: ['rescue', 'evacuation', 'emergency', 'helpline', 'relief', 'shelter'],
  infrastructure: ['power', 'electricity', 'water supply', 'closed', 'collapsed', 'damaged'],
}

export function detectCrisisType(claimText: string): string[] {
  const lowerText = claimText.toLowerCase()
  const types: string[] = []

  for (const [type, keywords] of Object.entries(CRISIS_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      types.push(type)
    }
  }

  return types.length > 0 ? types : ['general']
}

export function extractMumbaiLocation(claimText: string): string | null {
  const lowerText = claimText.toLowerCase()
  
  for (const location of MUMBAI_LOCATIONS) {
    if (lowerText.includes(location.toLowerCase())) {
      return location
    }
  }
  
  return null
}

export function generatePublicGuidance(verdict: string, crisisType: string[]): string {
  if (verdict === 'verified' || verdict === 'true') {
    if (crisisType.includes('transport')) {
      return '⚠️ Confirmed disruption. Plan alternate routes. Check official railway/traffic updates.'
    }
    if (crisisType.includes('flooding')) {
      return '⚠️ Confirmed flooding. Avoid affected areas. Follow BMC advisories. Stay safe.'
    }
    if (crisisType.includes('emergency')) {
      return '🚨 Confirmed emergency. Follow official instructions. Contact helplines if needed.'
    }
  }
  
  if (verdict === 'disputed' || verdict === 'false') {
    return '✅ This claim is FALSE. Do not panic. Verify from official sources before sharing.'
  }
  
  if (verdict === 'misleading') {
    return '⚠️ Partially true but misleading. Check official sources for accurate information.'
  }
  
  return 'ℹ️ Unverified. Wait for official confirmation before taking action.'
}

export const MUMBAI_EMERGENCY_CONTACTS = {
  police: '100',
  fire: '101',
  ambulance: '102',
  disaster: '108',
  bmc_control: '1916',
  traffic_helpline: '022-24937755',
  railway_enquiry: '139',
}
