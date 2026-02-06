import json
import random

# Đọc file JSON
with open('data/questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Đảo đáp án cho mỗi category
for category in ['career', 'study', 'social', 'policy']:
    for question in data[category]:
        # Lấy đáp án đúng hiện tại
        correct_answer = question['options'][question['correct']]
        
        # Tạo danh sách index và đảo ngẫu nhiên
        indices = list(range(len(question['options'])))
        random.shuffle(indices)
        
        # Tạo danh sách options mới theo thứ tự đã đảo
        new_options = [question['options'][i] for i in indices]
        
        # Cập nhật options và tìm vị trí mới của đáp án đúng
        question['options'] = new_options
        question['correct'] = new_options.index(correct_answer)

# Ghi lại file
with open('data/questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("✅ Đã đảo xong các đáp án!")
print("📊 Thống kê vị trí đáp án đúng:")
for category in ['career', 'study', 'social', 'policy']:
    positions = [q['correct'] for q in data[category]]
    print(f"  {category}: {positions}")
