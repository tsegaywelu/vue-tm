import sys

def check_balance(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    stack = []
    lines = content.split('\n')
    for i, line in enumerate(lines):
        for char in line:
            if char == '{':
                stack.append(('{', i + 1))
            elif char == '}':
                if not stack or stack[-1][0] != '{':
                    print(f"Mismatched '}}' at line {i + 1}")
                    return
                stack.pop()
            elif char == '[':
                stack.append(('[', i + 1))
            elif char == ']':
                if not stack or stack[-1][0] != '[':
                    print(f"Mismatched ']' at line {i + 1}")
                    return
                stack.pop()
    
    if stack:
        for char, line in stack:
            print(f"Unclosed '{char}' from line {line}")
    else:
        print("Balanced")

if __name__ == "__main__":
    check_balance(sys.argv[1])
