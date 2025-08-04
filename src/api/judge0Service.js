import axios from 'axios';

class Judge0Service {
  constructor() {
    this.apiUrl = import.meta.env.VITE_JUDGE0_API_URL;

    this.headers = {
      'Content-Type': 'application/json'
    };
  }

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
    return languageMap[language.toLowerCase()] || 63;
  }

  async submitCode(sourceCode, languageId, stdin = '', expectedOutput = '') {
    try {
      const encodedCode = btoa(sourceCode);
      const encodedInput = stdin ? btoa(stdin) : '';
      const encodedExpectedOutput = expectedOutput ? btoa(expectedOutput) : '';

      const response = await axios.post(
        `${this.apiUrl}/submissions`,
        {
          language_id: languageId,
          source_code: encodedCode,
          stdin: encodedInput,
          expected_output: encodedExpectedOutput
        },
        {
          params: {
            base64_encoded: 'true',
            wait: 'true',
            fields: '*'
          },
          headers: this.headers
        }
      );

      const result = response.data;

      try {
        if (result.stdout) result.stdout = atob(result.stdout);
        if (result.stderr) result.stderr = atob(result.stderr);
        if (result.compile_output) result.compile_output = atob(result.compile_output);
      } catch (decodeError) {
        console.warn('Error decoding Judge0 output:', decodeError);
      }

      return result;

    } catch (error) {
      console.error('Submission error:', error);
      const message = error.response?.data?.message || error.message;
      throw new Error(`Submission failed: ${message}`);
    }
  }

  async executeCode(sourceCode, language, stdin = '', expectedOutput = '') {
    try {
      const languageId = this.getLanguageId(language);
      const result = await this.submitCode(sourceCode, languageId, stdin, expectedOutput);
      return result;
    } catch (error) {
      console.error('Execution error:', error);
      throw new Error(`Execution failed: ${error.message}`);
    }
  }

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

  async getLanguages() {
    try {
      const response = await axios.get(`${this.apiUrl}/languages`, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      console.error('Error getting languages:', error);
      throw error;
    }
  }
}

export default new Judge0Service();
