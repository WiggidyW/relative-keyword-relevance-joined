# relative-keyword-relevance-joined

An [ObjectiveAI](https://objective-ai.io) Function for ranking content items by keyword relevance using a single combined prompt.

> **ObjectiveAI** is a platform for scoring, ranking, and simulating preferences using ensembles of LLMs. Learn more at [objective-ai.io](https://objective-ai.io) or see the [GitHub repository](https://github.com/ObjectiveAI/objectiveai).

## Overview

This function ranks multiple content items by their relevance to a set of keywords. All keywords are combined into a single prompt, asking "Which content is most relevant with regards to: [all keywords]?". Each LLM in the ensemble votes for the most relevant content item, and votes are aggregated into a ranking.

## Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `keywords` | `string[]` | Yes | Keywords to evaluate relevance against (minimum 1) |
| `contentItems` | `array` | Yes | Content items to rank (minimum 2) |

### Supported Content Types

Each item in `contentItems` can be:

- **Text** - Plain text strings
- **Image** - Image content
- **Video** - Video content
- **Audio** - Audio content
- **File** - File content
- **Array** - Multiple content pieces combined

## Output

A vector of scores, one per content item, that sum to 1. Higher scores indicate greater relevance to the combined keywords.

## Example

```json
{
  "input": {
    "keywords": ["artificial intelligence", "automation"],
    "contentItems": [
      "AI is revolutionizing automated manufacturing processes.",
      "The best pizza recipes from Italy.",
      "Machine learning automates data analysis tasks."
    ]
  }
}
```

Output: `[0.45, 0.02, 0.53]`

## How It Works

1. Constructs a prompt: "Which content is most relevant with regards to: artificial intelligence, automation?"
2. Presents all content items as response options
3. Each Ensemble LLM votes for the most relevant item
4. Votes are weighted and aggregated into final scores

## Comparison with Split Strategy

| Aspect | Joined (this function) | Split |
|--------|------------------------|-------|
| Prompts | 1 prompt with all keywords | 1 prompt per keyword |
| Keyword handling | Considers keyword relationships | Evaluates keywords independently |
| Best for | Thematic relevance | Keyword coverage |

## Default Profile

The default profile uses an ensemble of models from OpenAI, Google, Anthropic, xAI, and DeepSeek. Models with stronger reasoning capabilities receive higher weights in the voting.

## Related Functions

- [WiggidyW/relative-keyword-relevance](https://github.com/WiggidyW/relative-keyword-relevance) - Combines multiple ranking strategies
- [WiggidyW/relative-keyword-relevance-split](https://github.com/WiggidyW/relative-keyword-relevance-split) - Per-keyword ranking
- [WiggidyW/keyword-relevance-joined](https://github.com/WiggidyW/keyword-relevance-joined) - Scores a single content item
