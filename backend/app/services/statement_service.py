def analyze_statement(content, category):
    """
    分析个人陈述
    这里是一个示例实现，后续可以集成更复杂的NLP模型
    """
    # 基础评分标准
    criteria = {
        'length': (0.2, check_length),
        'structure': (0.3, check_structure),
        'relevance': (0.3, check_relevance),
        'language': (0.2, check_language)
    }
    
    # 计算总分
    total_score = 0
    feedback = []
    
    for criterion, (weight, check_func) in criteria.items():
        score, comments = check_func(content, category)
        total_score += score * weight
        feedback.extend(comments)
    
    return {
        'score': round(total_score, 2),
        'feedback': feedback
    }

def check_length(content, category):
    """检查文书长度"""
    words = len(content.split())
    score = 0
    comments = []
    
    if words < 300:
        score = 0.5
        comments.append("文书长度不足，建议扩充到至少500词。")
    elif words < 500:
        score = 0.7
        comments.append("文书长度适中，但可以适当增加内容。")
    elif words < 1000:
        score = 1.0
        comments.append("文书长度合适。")
    else:
        score = 0.8
        comments.append("文书可能过长，建议精简。")
    
    return score, comments

def check_structure(content, category):
    """检查文书结构"""
    paragraphs = content.split('\n\n')
    score = 0
    comments = []
    
    if len(paragraphs) < 3:
        score = 0.5
        comments.append("段落结构不清晰，建议至少包含开头、主体和结尾三个部分。")
    elif len(paragraphs) < 5:
        score = 0.8
        comments.append("段落结构基本合理。")
    else:
        score = 1.0
        comments.append("段落结构清晰。")
    
    return score, comments

def check_relevance(content, category):
    """检查内容相关性"""
    # 这里可以集成更复杂的NLP模型
    score = 0.8  # 示例分数
    comments = ["内容与申请目标基本相关，建议增加更多具体例子。"]
    
    return score, comments

def check_language(content, category):
    """检查语言表达"""
    # 这里可以集成更复杂的NLP模型
    score = 0.8  # 示例分数
    comments = ["语言表达流畅，注意避免重复用词。"]
    
    return score, comments
