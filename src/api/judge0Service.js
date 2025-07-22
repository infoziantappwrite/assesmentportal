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

  // Submit code for execution
  async submitCode(sourceCode, languageId, stdin = '', expectedOutput = '') {
    try {
      const response = await fetch(`${this.apiUrl}/submissions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          source_code: btoa(sourceCode), // Base64 encode
          language_id: languageId,
          stdin: stdin ? btoa(stdin) : '',
          expected_output: expectedOutput ? btoa(expectedOutput) : '',
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.token;
    } catch (error) {
      console.error('Error submitting code:', error);
      throw error;
    }
  }

  // Get submission result
  async getSubmissionResult(token) {
    try {
      const response = await fetch(`${this.apiUrl}/submissions/${token}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Decode base64 outputs
      if (result.stdout) result.stdout = atob(result.stdout);
      if (result.stderr) result.stderr = atob(result.stderr);
      if (result.compile_output) result.compile_output = atob(result.compile_output);

      return result;
    } catch (error) {
      console.error('Error getting submission result:', error);
      throw error;
    }
  }

  // Execute code and wait for result
  async executeCode(sourceCode, language, stdin = '', expectedOutput = '') {
    try {
      const languageId = this.getLanguageId(language);
      const token = await this.submitCode(sourceCode, languageId, stdin, expectedOutput);
      
      // Poll for result
      let result;
      let attempts = 0;
      const maxAttempts = 20; // Maximum 20 attempts (10 seconds)
      
      do {
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
        result = await this.getSubmissionResult(token);
        attempts++;
      } while (result.status.id <= 2 && attempts < maxAttempts); // Status 1 = In Queue, 2 = Processing

      return result;
    } catch (error) {
      console.error('Error executing code:', error);
      throw error;
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
