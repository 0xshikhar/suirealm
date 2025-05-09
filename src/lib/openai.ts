import { openai } from '@ai-sdk/openai';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
    // custom settings, e.g.
    compatibility: 'strict', // strict mode, enable when using the OpenAI API
});
