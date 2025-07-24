//utils/languageConfig.js

export const DEFAULT_SUPPORTED_LANGUAGES = [
  { language: 'javascript', name: 'JavaScript (Node.js)' },
  { language: 'python', name: 'Python 3' },
  { language: 'java', name: 'Java 11+' },
  { language: 'cpp', name: 'C++ (GCC)' },
  { language: 'c', name: 'C (GCC)' },
  { language: 'csharp', name: 'C# (.NET)' },
  { language: 'php', name: 'PHP 8+' },
  { language: 'ruby', name: 'Ruby 3+' },
  { language: 'go', name: 'Go 1.19+' },
  { language: 'rust', name: 'Rust 1.60+' },
  { language: 'swift', name: 'Swift 5+' },
  { language: 'kotlin', name: 'Kotlin 1.7+' },
  { language: 'typescript', name: 'TypeScript 4+' }
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
}`,

  csharp: `// C# Solution
using System;

class Program {
    static void Main() {
        // Write your code here
        Console.WriteLine("Hello World!");
    }
}`,

  php: `<?php
// PHP Solution
function solution() {
    // Write your code here
    echo "Hello World!\\n";
}

solution();
?>`,

  ruby: `# Ruby Solution
def solution
    # Write your code here
    puts "Hello World!"
end

solution()`,

  go: `// Go Solution
package main

import "fmt"

func main() {
    // Write your code here
    fmt.Println("Hello World!")
}`,

  rust: `// Rust Solution
fn main() {
    // Write your code here
    println!("Hello World!");
}`,

  swift: `// Swift Solution
import Foundation

func solution() {
    // Write your code here
    print("Hello World!")
}

solution()`,

  kotlin: `// Kotlin Solution
fun main() {
    // Write your code here
    println("Hello World!")
}`,

  typescript: `// TypeScript Solution
function solution(): void {
    // Write your code here
    console.log("Hello World!");
}

solution();`
};
