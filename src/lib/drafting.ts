import { Review, Location, Template, ToneProfile } from '@prisma/client'
import { PolicyGuard, PolicyCheckResult } from './policy'

export interface DraftRequest {
  reviewId: string
  toneProfileId?: string
  templateId?: string
  customPrompt?: string
}

export interface DraftResult {
  content: string
  violations: PolicyCheckResult
  status: 'DRAFT' | 'APPROVED' | 'NEEDS_REVIEW'
}

export class DraftingPipeline {
  static async generateDraft(
    review: Review,
    location: Location,
    template?: Template,
    toneProfile?: ToneProfile,
    customPrompt?: string
  ): Promise<DraftResult> {
    // Build context for the AI
    const context = this.buildContext(review, location, template, toneProfile)
    
    // Generate content using AI
    const content = await this.generateContent(context, customPrompt)
    
    // Apply policy checks
    const violations = PolicyGuard.checkDraft(content, review.rating, review.languageCode)
    
    // Determine status based on policy results
    let status: 'DRAFT' | 'APPROVED' | 'NEEDS_REVIEW' = 'DRAFT'
    
    if (violations.blocked) {
      status = 'DRAFT' // Can't be approved if blocked
    } else if (violations.needsReview || review.rating <= 3) {
      status = 'NEEDS_REVIEW'
    } else if (review.rating >= 4 && violations.violations.length === 0) {
      status = 'APPROVED' // Auto-approve high-rated reviews with no violations
    }
    
    return {
      content,
      violations,
      status
    }
  }

  private static buildContext(
    review: Review,
    location: Location,
    template?: Template,
    toneProfile?: ToneProfile
  ): string {
    const context = {
      business: {
        name: location.name,
        address: location.address,
        phone: location.phone,
      },
      review: {
        rating: review.rating,
        text: review.text,
        title: review.title,
        author: review.authorName,
        language: review.languageCode,
      },
      template: template?.content || '',
      tone: toneProfile?.settings || {},
    }

    return JSON.stringify(context, null, 2)
  }

  private static async generateContent(context: string, customPrompt?: string): Promise<string> {
    // Use the model router to generate content
    const modelRouter = await import('./modelRouter')
    
    const prompt = customPrompt || this.buildDefaultPrompt(context)
    
    try {
      const response = await modelRouter.generateResponse(prompt, context)
      return response
    } catch (error) {
      console.error('Error generating AI response:', error)
      // Fallback to template-based generation
      return this.generateFallbackResponse(context)
    }
  }

  private static buildDefaultPrompt(context: string): string {
    return `You are writing an owner response to a public review for a local business. 

Keep your response:
- Short and human (under 150 words)
- Contextually specific to the review content
- Professional but warm
- Focused on the specific feedback

For positive reviews: Thank the reviewer genuinely and mention something specific from their feedback.

For negative reviews: 
- Acknowledge the issue without making excuses
- State one concrete next step you'll take
- Invite them to contact you offline for resolution
- Avoid promises you cannot keep

Rules:
- No incentives, discounts, or requests to change the review
- Do not include personal data or order numbers
- Use the business name naturally
- Mirror the language of the review if possible
- If the review mentions safety concerns, recommend escalation

Context: ${context}

Generate a natural, helpful response:`
  }

  private static generateFallbackResponse(context: string): string {
    const parsedContext = JSON.parse(context)
    const { business, review } = parsedContext
    
    if (review.rating >= 4) {
      return `Thank you for your ${review.rating}-star review! We're delighted that you had a great experience at ${business.name}. Your feedback means a lot to us and helps us continue providing excellent service. We look forward to serving you again soon!`
    } else {
      return `Thank you for your feedback. We take all reviews seriously and appreciate you taking the time to share your experience. We'd like to address your concerns directly - please contact us at ${business.phone} so we can work towards a resolution.`
    }
  }

  static applyTemplate(content: string, template: Template, review: Review): string {
    let result = template.content
    
    // Replace template tokens
    result = result.replace(/\{\{business_name\}\}/g, review.location?.name || 'our business')
    result = result.replace(/\{\{rating\}\}/g, review.rating.toString())
    result = result.replace(/\{\{review_text\}\}/g, review.text)
    result = result.replace(/\{\{author_name\}\}/g, review.authorName || 'the reviewer')
    
    // Add custom content if template has placeholders
    if (result.includes('{{custom_content}}')) {
      result = result.replace('{{custom_content}}', content)
    }
    
    return result
  }

  static applyToneProfile(content: string, toneProfile: ToneProfile): string {
    let result = content
    
    // Apply warmth settings
    if (toneProfile.settings.warmth === 'high') {
      result = result.replace(/\./g, '!')
      result = result.replace(/\b(thank you|thanks)\b/gi, 'Thank you so much')
    }
    
    // Apply formality settings
    if (toneProfile.settings.formality === 'high') {
      result = result.replace(/\b(we're|we'll|we've)\b/gi, 'we are')
      result = result.replace(/\b(you're|you'll|you've)\b/gi, 'you are')
    }
    
    // Apply signoff
    if (toneProfile.settings.signoff) {
      const signoff = toneProfile.settings.signoff.replace(/\{\{business_name\}\}/g, 'our business')
      result = result.replace(/\n*$/, `\n\n${signoff}`)
    }
    
    return result
  }
}
