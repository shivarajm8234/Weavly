export interface GroqGenerationRequest {
  sareeType: string;
  fabricType: string;
  designStyle: string;
  hookWidth: number;
  hookHeight: number;
  bodyPrompt?: string;
  palluPrompt?: string;
  borderPrompt?: string;
  blousePrompt?: string;
  paletteColors?: string[];
  regionToRegenerate?: 'body' | 'border' | 'pallu' | 'blouse';
}

export interface GeneratedDesignSpec {
  title: string;
  conceptSummary: string;
  technique: string;
  regions: {
    body: {
      motifId: string;
      pattern: string;
      density: number;
      scale: number;
      rotation: number;
      symmetry: string;
      repeatType: string;
      prompt: string;
    };
    border: {
      motifId: string;
      pattern: string;
      density: number;
      scale: number;
      rotation: number;
      symmetry: string;
      repeatType: string;
      prompt: string;
    };
    pallu: {
      motifId: string;
      pattern: string;
      density: number;
      scale: number;
      rotation: number;
      symmetry: string;
      repeatType: string;
      prompt: string;
    };
    blouse: {
      motifId: string;
      pattern: string;
      density: number;
      scale: number;
      rotation: number;
      symmetry: string;
      repeatType: string;
      prompt: string;
    };
  };
  palette: Array<{
    name: string;
    hex: string;
    role: 'primary' | 'secondary' | 'accent' | 'zari';
  }>;
  jacquardNotes: {
    warpDensity: string;
    weftPicks: string;
    zariType: string;
    weaveStructure: string;
  };
}

const GROQ_API_KEY = process.env.GROQ_API_KEY || 'REDACTED_API_KEY';
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

export class GroqProvider {
  static async generateDesign(req: GroqGenerationRequest): Promise<GeneratedDesignSpec> {
    const systemPrompt = `You are a master Jacquard Textile Designer specializing in traditional and contemporary Indian sarees (Kanjivaram, Banarasi, Chanderi, Paithani, Patola, etc.).
Given the designer's input, generate a complete, authentic Jacquard saree specification in valid JSON format.

Available Motifs to select for regions:
- kalka_classic (Kalka / Paisley)
- temple_spire (Gopuram / Temple Peak)
- kamal_lotus (Royal Lotus)
- mayil_peacock (Mayil / Peacock)
- gaja_elephant (Gaja / Royal Elephant)
- kairi_mango (Kairi / Raw Mango)
- floral_bel (Bel / Flowing Floral Vine)
- rudraksha_bead (Rudraksha / Sacred Bead)
- jali_lattice (Jali / Mughal Lattice)
- leheriya_wave (Leheriya / Zigzag Wave)
- butti_coin (Ashoka Butti / Coin Medallion)
- kalash_sacred (Kalash / Sacred Urn)
- sun_suryamukhi (Suryamukhi / Radiant Sun)
- shikargah_deer (Shikargah / Deer)
- ashavali_flower (Ashavali / Ahmedabad Rosette)
- kili_parrot (Kili / Twin Parrots)

Available Patterns: floral, geometric, traditional, abstract, minimal, temple, paisley, chevron
Available Repeat Types: tile, halfdrop, brick, mirror, radial
Available Symmetries: none, horizontal, vertical, dual, rotational

Return ONLY valid JSON adhering strictly to this schema:
{
  "title": "string",
  "conceptSummary": "string",
  "technique": "string",
  "regions": {
    "body": { "motifId": "string", "pattern": "string", "density": 50, "scale": 1, "rotation": 0, "symmetry": "vertical", "repeatType": "brick", "prompt": "string" },
    "border": { "motifId": "string", "pattern": "string", "density": 65, "scale": 0.9, "rotation": 0, "symmetry": "horizontal", "repeatType": "tile", "prompt": "string" },
    "pallu": { "motifId": "string", "pattern": "string", "density": 75, "scale": 1.4, "rotation": 0, "symmetry": "dual", "repeatType": "radial", "prompt": "string" },
    "blouse": { "motifId": "string", "pattern": "string", "density": 40, "scale": 0.8, "rotation": 0, "symmetry": "none", "repeatType": "tile", "prompt": "string" }
  },
  "palette": [
    { "name": "string", "hex": "#HEX", "role": "primary" },
    { "name": "string", "hex": "#HEX", "role": "secondary" },
    { "name": "string", "hex": "#HEX", "role": "accent" },
    { "name": "string", "hex": "#HEX", "role": "zari" }
  ],
  "jacquardNotes": {
    "warpDensity": "string",
    "weftPicks": "string",
    "zariType": "string",
    "weaveStructure": "string"
  }
}`;

    const userPrompt = `Generate a Jacquard Saree design:
- Saree Type: ${req.sareeType}
- Fabric: ${req.fabricType}
- Style: ${req.designStyle}
- Jacquard Hooks: ${req.hookWidth} hooks × ${req.hookHeight} picks
- Body Requirement: ${req.bodyPrompt || 'Traditional floral geometric pattern'}
- Pallu Requirement: ${req.palluPrompt || 'Grand heavy temple or royal peacock motif'}
- Border Requirement: ${req.borderPrompt || 'Zari temple or bel border'}
- Blouse Requirement: ${req.blousePrompt || 'Matching subtle butti'}
${req.paletteColors && req.paletteColors.length > 0 ? `- Color Palette preference: ${req.paletteColors.join(', ')}` : ''}
${req.regionToRegenerate ? `- SPECIFIC REGION TO REGENERATE: ${req.regionToRegenerate}` : ''}
`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error (${response.status}): ${errorText}`);
      }

      const json = await response.json();
      const rawContent = json.choices?.[0]?.message?.content;
      if (!rawContent) {
        throw new Error('Empty response from Groq');
      }

      const parsed = JSON.parse(rawContent);
      return parsed as GeneratedDesignSpec;
    } catch (err) {
      console.warn('Groq AI generation fallback triggered:', err);
      // Deterministic fallback if offline or API limit reached
      return this.fallbackDesign(req);
    }
  }

  static fallbackDesign(req: GroqGenerationRequest): GeneratedDesignSpec {
    return {
      title: `${req.sareeType} - Heritage Collection`,
      conceptSummary: `A rich ${req.sareeType} woven with authentic Jacquard patterns, featuring intricate zari highlights and harmonious motifs.`,
      technique: 'Extra-weft brocade weaving on mechanical/electronic Jacquard harness',
      regions: {
        body: {
          motifId: 'kalka_classic',
          pattern: 'traditional',
          density: 45,
          scale: 1.0,
          rotation: 0,
          symmetry: 'vertical',
          repeatType: 'brick',
          prompt: req.bodyPrompt || 'All-over kalka butti with subtle float structure',
        },
        border: {
          motifId: 'temple_spire',
          pattern: 'temple',
          density: 70,
          scale: 0.9,
          rotation: 0,
          symmetry: 'horizontal',
          repeatType: 'tile',
          prompt: req.borderPrompt || 'Traditional temple korvai border with pure zari bands',
        },
        pallu: {
          motifId: 'kamal_lotus',
          pattern: 'floral',
          density: 75,
          scale: 1.5,
          rotation: 0,
          symmetry: 'dual',
          repeatType: 'radial',
          prompt: req.palluPrompt || 'Grand royal lotus centerpiece flanked by intricate peacocks',
        },
        blouse: {
          motifId: 'butti_coin',
          pattern: 'geometric',
          density: 35,
          scale: 0.75,
          rotation: 0,
          symmetry: 'none',
          repeatType: 'tile',
          prompt: req.blousePrompt || 'Subtle coin butti coordinated with body field',
        },
      },
      palette: [
        { name: 'Royal Crimson', hex: '#800020', role: 'primary' },
        { name: 'Antique Gold Zari', hex: '#D4AF37', role: 'zari' },
        { name: 'Deep Ochre', hex: '#B8860B', role: 'secondary' },
        { name: 'Ivory Cream', hex: '#FFFDD0', role: 'accent' },
      ],
      jacquardNotes: {
        warpDensity: `${req.hookWidth} ends/repeat`,
        weftPicks: `${req.hookHeight} picks/repeat`,
        zariType: 'Pure Silver/Gilded Copper Metallic Zari Yarn',
        weaveStructure: 'Satin ground with 7/1 twill extra-weft figuring',
      },
    };
  }
}
