//utils/languageConfig.js

export const DEFAULT_SUPPORTED_LANGUAGES = [
  { language: 'javascript', name: 'JavaScript (Node.js)' },
  { language: 'python', name: 'Python 3' },
  { language: 'java', name: 'Java 11+' },
  { language: 'cpp', name: 'C++ (GCC)' },
  { language: 'c', name: 'C (GCC)' }
];

export const LANGUAGE_TEMPLATES = {
  javascript: `// JavaScript Solution
function solution() {
    // Write your code here
    console.log("Hello World!");
}

solution();`,

  python: `# Python Solution
def solution():
    # Write your code here
    print("Hello World!")

if __name__ == "__main__":
    solution()`,

  java: `// Java Solution
public class Main {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello World!");
    }
}`,

  cpp: `// C++ Solution
#include <iostream>
using namespace std;

int main() {
    // Write your code here
    cout << "Hello World!" << endl;
    return 0;
}`,

  c: `// C Solution
#include <stdio.h>

int main() {
    // Write your code here
    printf("Hello World!\\n");
    return 0;
}`
};
