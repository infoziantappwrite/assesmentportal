// Judge0 API Service
class Judge0Service {
  constructor() {
    this.apiUrl = import.meta.env.VITE_JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
    this.apiKey = import.meta.env.VITE_JUDGE0_API_KEY;
    this.headers = {
      'Content-Type': 'application/json',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'X-RapidAPI-Key': this.apiKey
    };
  }

  // Language mapping for Judge0
  getLanguageId(language) {
    const languageMap = {
      'javascript': 63,
      'python': 71,
      'java': 62,
      'cpp': 54,
      'c': 50,
      'csharp': 51,
      'php': 68,
      'ruby': 72,
      'go': 60,
      'rust': 73,
      'swift': 83,
      'kotlin': 78,
      'typescript': 74,
    };
    return languageMap[language.toLowerCase()] || 63; // Default to JavaScript
  }

  // Submit code for execution with improved error handling
  async submitCode(sourceCode, languageId, stdin = '', expectedOutput = '') {
    try {
      console.log('Submitting code to Judge0 RapidAPI...', { 
        apiUrl: this.apiUrl,
        language: languageId, 
        codeLength: sourceCode.length,
        hasApiKey: !!this.apiKey,
        usingRapidAPI: this.apiUrl.includes('rapidapi.com')
      });

      if (!this.apiKey) {
        throw new Error('Judge0 API key is not configured. Please check your environment variables.');
      }

      const response = await fetch(`${this.apiUrl}/submissions?base64_encoded=true&wait=false`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          source_code: btoa(sourceCode), // Base64 encode
          language_id: languageId,
          stdin: stdin ? btoa(stdin) : '',
          expected_output: expectedOutput ? btoa(expectedOutput) : '',
        })
      });

      console.log('Judge0 submission response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Judge0 submission error:', { 
          status: response.status, 
          statusText: response.statusText,
          error: errorText
        });
        
        if (response.status === 401) {
          throw new Error('RapidAPI Authentication failed. Please verify your Judge0 API key and subscription status.');
        } else if (response.status === 429) {
          throw new Error('RapidAPI Rate limit exceeded. Please try again later or upgrade your plan.');
        } else if (response.status === 403) {
          throw new Error('RapidAPI Access forbidden. Please check your subscription and endpoint permissions.');
        } else {
          throw new Error(`Judge0 RapidAPI error (${response.status}): ${response.statusText}`);
        }
      }

      const result = await response.json();
      console.log('Code submitted successfully, token:', result.token);
      return result.token;
    } catch (error) {
      console.error('Error submitting code:', error);
      throw error;
    }
  }

  // Get submission result with improved error handling
  async getSubmissionResult(token) {
    try {
      const response = await fetch(`${this.apiUrl}/submissions/${token}?base64_encoded=true`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Judge0 result fetch error:', response.status, errorText);
        throw new Error(`Judge0 API error (${response.status}): ${errorText}`);
      }

      const result = await response.json();
      
      // Decode base64 outputs safely
      try {
        if (result.stdout) result.stdout = atob(result.stdout);
        if (result.stderr) result.stderr = atob(result.stderr);
        if (result.compile_output) result.compile_output = atob(result.compile_output);
      } catch (decodeError) {
        console.warn('Error decoding Judge0 output:', decodeError);
      }

      return result;
    } catch (error) {
      console.error('Error getting submission result:', error);
      throw new Error(`Failed to get execution result: ${error.message}`);
    }
  }

  // Execute code and wait for result with better error handling
  async executeCode(sourceCode, language, stdin = '', expectedOutput = '') {
    try {
      const languageId = this.getLanguageId(language);
      console.log(`Executing ${language} code (language ID: ${languageId})`);
      
      const token = await this.submitCode(sourceCode, languageId, stdin, expectedOutput);
      
      // Poll for result with exponential backoff
      let result;
      let attempts = 0;
      const maxAttempts = 30; // Maximum 30 attempts (15 seconds)
      let delay = 500; // Start with 500ms delay
      
      do {
        await new Promise(resolve => setTimeout(resolve, delay));
        result = await this.getSubmissionResult(token);
        attempts++;
        
        // Increase delay slightly for longer running code
        if (attempts > 10) delay = 1000;
        
        console.log(`Attempt ${attempts}: Status ${result.status.id} - ${result.status.description}`);
      } while (result.status.id <= 2 && attempts < maxAttempts); // Status 1 = In Queue, 2 = Processing

      if (attempts >= maxAttempts && result.status.id <= 2) {
        throw new Error('Code execution timeout - your code is taking too long to run');
      }

      return result;
    } catch (error) {
      console.error('Error executing code:', error);
      throw new Error(`Execution failed: ${error.message}`);
    }
  }

  // Execute code with test cases
  async executeWithTestCases(sourceCode, language, testCases) {
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const result = await this.executeCode(
          sourceCode, 
          language, 
          testCase.input, 
          testCase.expected_output
        );
        
        results.push({
          input: testCase.input,
          expected_output: testCase.expected_output,
          actual_output: result.stdout || '',
          status: result.status.description === 'Accepted' ? 'PASSED' : 'FAILED',
          error: result.stderr || result.compile_output || '',
          execution_time: result.time,
          memory_usage: result.memory
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expected_output: testCase.expected_output,
          actual_output: '',
          status: 'ERROR',
          error: error.message,
          execution_time: null,
          memory_usage: null
        });
      }
    }
    
    return results;
  }

  // Get available languages
  async getLanguages() {
    try {
      const response = await fetch(`${this.apiUrl}/languages`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting languages:', error);
      throw error;
    }
  }
}

export default new Judge0Service();
