import { Functions } from "objectiveai";
import { ExampleInput } from "./example_input";

export const Function: Functions.RemoteFunction = {
  type: "vector.function",
  description:
    "Keyword-based Relevance Rankings. Discover which piece of content is most relevant to specific keywords. Joins each keyword and executes a single Vector Completion Task.",
  input_schema: {
    type: "object",
    properties: {
      keywords: {
        type: "array",
        description: "Keywords to evaluate relevance against.",
        minItems: 1,
        items: {
          type: "string",
          description: "A keyword to evaluate relevance against.",
        },
      },
      contentItems: {
        type: "array",
        description: "Content items to be ranked for relevance.",
        minItems: 1,
        items: {
          anyOf: [
            {
              type: "string",
              description: "Text content to be evaluated for relevance.",
            },
            {
              type: "image",
              description: "Image content to be evaluated for relevance.",
            },
            {
              type: "video",
              description: "Video content to be evaluated for relevance.",
            },
            {
              type: "audio",
              description: "Audio content to be evaluated for relevance.",
            },
            {
              type: "file",
              description: "File content to be evaluated for relevance.",
            },
            {
              type: "array",
              description:
                "Array of content pieces to be evaluated for relevance.",
              minItems: 1,
              items: {
                anyOf: [
                  {
                    type: "string",
                    description: "Text content to be evaluated for relevance.",
                  },
                  {
                    type: "image",
                    description: "Image content to be evaluated for relevance.",
                  },
                  {
                    type: "video",
                    description: "Video content to be evaluated for relevance.",
                  },
                  {
                    type: "audio",
                    description: "Audio content to be evaluated for relevance.",
                  },
                  {
                    type: "file",
                    description: "File content to be evaluated for relevance.",
                  },
                ],
              },
            },
          ],
        },
      },
    },
    required: ["keywords", "contentItems"],
  },
  tasks: [
    {
      type: "vector.completion",
      messages: [
        {
          role: "user",
          content: {
            $jmespath:
              "join('',['Which content is most relevant with regards to:\n- ',join('\n- ',input.keywords)])",
          },
        },
      ],
      responses: {
        $jmespath:
          "input.contentItems[].input_value_switch(@,`null`,&[].input_value_switch(@,`null`,`null`,&{type:'text',text:@},`null`,`null`,`null`,@,@,@,@),@,`null`,`null`,`null`,@,@,@,@)",
      },
    },
  ],
  output: {
    $jmespath: "tasks[0].scores",
  },
  output_length: {
    $jmespath: "length(input.contentItems)",
  },
  input_split: {
    $jmespath:
      "zip_map(&{keywords:@[0],contentItems:[@[1]]},[repeat(input.keywords,length(input.contentItems)),input.contentItems])",
  },
  input_merge: {
    $jmespath:
      "@.{keywords:input[0].keywords,contentItems:input[].contentItems[0]}",
  },
};

export const Profile: Functions.RemoteProfile = {
  description:
    "The default profile for `WiggidyW/relative-keyword-relevance-joined`. Reasoning models have higher weight. Supports multi-modal content.",
  tasks: [
    {
      ensemble: {
        llms: [
          {
            model: "openai/gpt-4.1-nano",
            output_mode: "json_schema",
          },
          {
            model: "openai/gpt-4.1-nano",
            output_mode: "json_schema",
            temperature: 0.75,
          },
          {
            model: "openai/gpt-4.1-nano",
            output_mode: "json_schema",
            temperature: 1.25,
          },
          {
            model: "google/gemini-2.5-flash-lite",
            output_mode: "json_schema",
          },
          {
            model: "google/gemini-3-flash-preview",
            output_mode: "json_schema",
          },
          {
            model: "x-ai/grok-4.1-fast",
            output_mode: "json_schema",
            temperature: 0.75,
            reasoning: {
              enabled: false,
            },
          },
          {
            model: "x-ai/grok-4.1-fast",
            output_mode: "json_schema",
            temperature: 1.25,
            reasoning: {
              enabled: false,
            },
          },
          {
            model: "anthropic/claude-haiku-4.5",
            output_mode: "instruction",
          },
          {
            count: 3,
            model: "deepseek/deepseek-v3.2",
            output_mode: "instruction",
            top_logprobs: 20,
          },
          {
            model: "google/gemini-2.5-flash-lite",
            output_mode: "json_schema",
            temperature: 0.75,
          },
          {
            model: "openai/gpt-5-mini",
            output_mode: "json_schema",
          },
          {
            model: "google/gemini-2.5-flash-lite",
            output_mode: "json_schema",
            temperature: 1.25,
          },
          {
            count: 3,
            model: "openai/gpt-4o-mini",
            output_mode: "json_schema",
            top_logprobs: 20,
          },
          {
            model: "x-ai/grok-4.1-fast",
            output_mode: "json_schema",
            reasoning: {
              enabled: false,
            },
          },
        ],
      },
      profile: [
        0.2, 0.2, 0.2, 0.2, 1.0, 0.2, 0.2, 1.0, 0.2, 0.2, 1.0, 0.2, 0.2, 0.2,
      ],
    },
  ],
};

export const ExampleInputs: ExampleInput[] = [
  {
    value: {
      keywords: ["serverless computing"],
      contentItems: [
        "Lambda functions automatically scale based on incoming request volume, with AWS handling all underlying infrastructure provisioning and management.",
        "The server room was incredibly hot. Like, really hot. Someone forgot to turn on the AC again and now all the fans are spinning at max speed.",
        "our IT guy said something about 'the cloud' but honestly i just nod and smile whenever he talks tech stuff",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 3,
  },
  {
    value: {
      keywords: ["organic farming", "pesticide-free"],
      contentItems: [
        "USDA Certified Organic produce must be grown without synthetic fertilizers, sewage sludge, irradiation, or genetic engineering for a minimum of three years.",
        "My neighbor's farm uses traditional methods passed down for generations. No fancy labels, just good honest vegetables.",
        "BEST DEALS ON ELECTRONICS!!! TVs, phones, laptops!!! Nothing organic about these prices—they're artificially LOW! 📺📱💻",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 3,
  },
  {
    value: {
      keywords: ["existentialism", "Sartre", "philosophy"],
      contentItems: [
        "Existence precedes essence—we are condemned to be free, responsible for creating meaning in an indifferent universe through our choices and actions.",
        "idk why im here tbh. just scrolling through my phone at 3am questioning everything. normal tuesday night i guess",
        "The bookshelf at the thrift store had some old philosophy textbooks. Didn't buy any though, too heavy to carry home.",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 3,
  },
  {
    value: {
      keywords: ["epidemiology", "public health"],
      contentItems: [
        "Contact tracing combined with targeted quarantine measures proved more effective than broad lockdowns in controlling transmission during the initial outbreak phase.",
        "i called in sick to work today but actually im fine lol just didnt feel like going in",
        "The hospital cafeteria serves surprisingly good food. Their chicken soup is genuinely healing—or at least it feels that way!",
        "R₀ values above 1.0 indicate exponential growth potential; sustained values below 1.0 lead to eventual epidemic burnout.",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 4,
  },
  {
    value: {
      keywords: ["ballet", "dance performance"],
      contentItems: [
        "The prima ballerina executed a flawless series of fouettés, completing thirty-two rotations without traveling from her center point on stage.",
        "My daughter's recital is next week. She's been practicing her routine nonstop—the living room has become a dance studio!",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 2,
  },
  {
    value: {
      keywords: ["mechanical keyboards", "typing"],
      contentItems: [
        "Cherry MX Blue switches provide tactile feedback with an audible click at the actuation point, preferred by typists who value acoustic confirmation.",
        "I HATE MY COWORKER'S LOUD KEYBOARD!!! CLICK CLACK CLICK CLACK ALL DAY LONG!!! SOME OF US ARE TRYING TO CONCENTRATE!!!",
        "The document was typed neatly, double-spaced, with one-inch margins on all sides as specified in the style guide.",
        "Lubing stabilizers with Krytox 205g0 eliminates rattle and creates a smoother bottom-out feel on larger keys.",
        "my laptop keyboard is fine i guess? never really thought about it tbh",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 5,
  },
  {
    value: {
      keywords: ["archaeology", "ancient civilizations"],
      contentItems: [
        "Stratification analysis revealed seven distinct occupation layers spanning from the Early Bronze Age through the Hellenistic period at the Tel Megiddo site.",
        "Found an old coin in my backyard while gardening. Probably just dropped it last summer tbh but my kid thinks it's pirate treasure.",
        "Indiana Jones is my favorite movie series! The way he finds all those artifacts is so cool even if it's not realistic.",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 3,
  },
  {
    value: {
      keywords: ["standup comedy", "humor"],
      contentItems: [
        "The comedian's callback to an earlier bit about airline food landed perfectly, demonstrating masterful set construction and audience memory management.",
        "why did the chicken cross the road?? to get to the other side HAHAHAHA 🐔 sorry im not funny",
        "My uncle thinks he's hilarious. He's not. Every family dinner is the same three jokes on repeat.",
        "Timing is everything—the pause before the punchline creates tension that makes the release exponentially funnier.",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 4,
  },
  {
    value: {
      keywords: ["sourdough", "bread baking", "fermentation"],
      contentItems: [
        "Maintain your starter at 100% hydration, feeding equal weights of flour and water every 12 hours until it reliably doubles within 4-6 hours.",
        "Just bought some bread from the store. Wonder Bread. It's fine. Does the job.",
        "The tangy flavor develops as lactobacillus bacteria produce lactic and acetic acids during the long, slow fermentation process.",
        "My attempt at homemade bread was... edible? It was supposed to rise but ended up more like a frisbee lmao",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 4,
  },
  {
    value: {
      keywords: ["tattoo artistry", "body modification"],
      contentItems: [
        "Proper needle depth—approximately 1-2mm into the dermis—ensures pigment retention while minimizing scarring and blowout.",
        "Got a temp tattoo from a cereal box when I was 8. Thought I was so cool. Mom made me wash it off for school pictures.",
        "The studio maintains strict autoclave sterilization protocols and uses single-use disposable equipment for all procedures.",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: null,
      },
    ],
    outputLength: 3,
  },
];
