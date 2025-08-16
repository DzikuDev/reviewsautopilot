export interface PolicyViolation {
  type: 'pii' | 'incentive' | 'legal' | 'medical' | 'safety' | 'language_mismatch' | 'review_gating'
  severity: 'low' | 'medium' | 'high'
  description: string
  blocked: boolean
}

export interface PolicyCheckResult {
  violations: PolicyViolation[]
  blocked: boolean
  needsReview: boolean
}

export class PolicyGuard {
  private static readonly INCENTIVE_PATTERNS = [
    /\b(discount|voucher|coupon|refund|free|offer|deal|promotion)\b/i,
    /\b(change.*review|update.*review|remove.*review)\b/i,
    /\b(only.*positive|only.*great|only.*good)\b/i,
  ]

  private static readonly PII_PATTERNS = [
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone numbers
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email addresses
    /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/, // IBAN
    /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/, // Credit card numbers
  ]

  private static readonly SAFETY_KEYWORDS = [
    'safety', 'dangerous', 'hazard', 'unsafe', 'injury', 'accident', 'emergency',
    'fire', 'explosion', 'toxic', 'poison', 'harmful'
  ]

  private static readonly LEGAL_KEYWORDS = [
    'lawsuit', 'legal', 'attorney', 'lawyer', 'court', 'judge', 'settlement',
    'compensation', 'damages', 'liability', 'negligence'
  ]

  private static readonly MEDICAL_KEYWORDS = [
    'medical', 'doctor', 'physician', 'treatment', 'diagnosis', 'prescription',
    'medication', 'surgery', 'hospital', 'clinic', 'health'
  ]

  static checkDraft(content: string, reviewRating: number, languageCode?: string): PolicyCheckResult {
    const violations: PolicyViolation[] = []
    let blocked = false
    let needsReview = false

    // Check for incentives
    if (this.hasIncentivePatterns(content)) {
      violations.push({
        type: 'incentive',
        severity: 'high',
        description: 'Content contains incentives or requests to change reviews',
        blocked: true
      })
      blocked = true
    }

    // Check for PII
    if (this.hasPIIPatterns(content)) {
      violations.push({
        type: 'pii',
        severity: 'high',
        description: 'Content contains personal identifiable information',
        blocked: true
      })
      blocked = true
    }

    // Check for safety concerns
    if (this.hasSafetyKeywords(content)) {
      violations.push({
        type: 'safety',
        severity: 'high',
        description: 'Content mentions safety concerns that require review',
        blocked: false
      })
      needsReview = true
    }

    // Check for legal content
    if (this.hasLegalKeywords(content)) {
      violations.push({
        type: 'legal',
        severity: 'medium',
        description: 'Content mentions legal matters that require review',
        blocked: false
      })
      needsReview = true
    }

    // Check for medical content
    if (this.hasMedicalKeywords(content)) {
      violations.push({
        type: 'medical',
        severity: 'medium',
        description: 'Content mentions medical matters that require review',
        blocked: false
      })
      needsReview = true
    }

    // Check for low rating reviews (1-3 stars)
    if (reviewRating <= 3) {
      violations.push({
        type: 'language_mismatch',
        severity: 'medium',
        description: 'Low rating review requires manual approval',
        blocked: false
      })
      needsReview = true
    }

    // Check for review gating
    if (this.hasReviewGating(content)) {
      violations.push({
        type: 'review_gating',
        severity: 'high',
        description: 'Content attempts to gate reviews or filter feedback',
        blocked: true
      })
      blocked = true
    }

    return {
      violations,
      blocked,
      needsReview
    }
  }

  private static hasIncentivePatterns(content: string): boolean {
    return this.INCENTIVE_PATTERNS.some(pattern => pattern.test(content))
  }

  private static hasPIIPatterns(content: string): boolean {
    return this.PII_PATTERNS.some(pattern => pattern.test(content))
  }

  private static hasSafetyKeywords(content: string): boolean {
    return this.SAFETY_KEYWORDS.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  private static hasLegalKeywords(content: string): boolean {
    return this.LEGAL_KEYWORDS.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  private static hasMedicalKeywords(content: string): boolean {
    return this.MEDICAL_KEYWORDS.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  private static hasReviewGating(content: string): boolean {
    const gatingPatterns = [
      /\b(only.*if.*experience.*great|only.*if.*happy|only.*if.*satisfied)\b/i,
      /\b(contact.*us.*if.*problem|let.*us.*know.*if.*issue)\b/i,
      /\b(positive.*feedback.*only|good.*reviews.*only)\b/i
    ]
    
    return gatingPatterns.some(pattern => pattern.test(content))
  }

  static sanitizeContent(content: string): string {
    // Remove PII patterns
    let sanitized = content
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
      .replace(/\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/g, '[IBAN]')
      .replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, '[CARD]')

    return sanitized
  }
}
