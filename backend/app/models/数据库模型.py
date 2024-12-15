from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class 用户(db.Model):
    __tablename__ = '用户表'
    
    id = db.Column(db.Integer, primary_key=True)
    用户名 = db.Column(db.String(80), unique=True, nullable=False)
    邮箱 = db.Column(db.String(120), unique=True, nullable=False)
    密码哈希 = db.Column(db.String(128))
    是否验证邮箱 = db.Column(db.Boolean, default=False)
    是否高级会员 = db.Column(db.Boolean, default=False)
    会员到期时间 = db.Column(db.DateTime)
    创建时间 = db.Column(db.DateTime, default=datetime.utcnow)
    
    def 设置密码(self, 密码):
        self.密码哈希 = generate_password_hash(密码)

    def 验证密码(self, 密码):
        return check_password_hash(self.密码哈希, 密码)

class 大学(db.Model):
    __tablename__ = '大学表'
    
    id = db.Column(db.Integer, primary_key=True)
    名称 = db.Column(db.String(200), nullable=False)
    英文名称 = db.Column(db.String(200))
    国家 = db.Column(db.String(100))
    州省 = db.Column(db.String(100))
    城市 = db.Column(db.String(100))
    排名 = db.Column(db.Integer)
    录取率 = db.Column(db.Float)
    学费 = db.Column(db.Float)
    开设专业 = db.Column(db.JSON)  # 存储专业列表
    申请要求 = db.Column(db.JSON)  # 存储申请要求
    创建时间 = db.Column(db.DateTime, default=datetime.utcnow)
    更新时间 = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class 录取记录(db.Model):
    __tablename__ = '录取记录表'
    
    id = db.Column(db.Integer, primary_key=True)
    用户id = db.Column(db.Integer, db.ForeignKey('用户表.id'))
    大学id = db.Column(db.Integer, db.ForeignKey('大学表.id'))
    专业 = db.Column(db.String(100))
    申请年份 = db.Column(db.Integer)
    GPA = db.Column(db.Float)
    语言成绩 = db.Column(db.JSON)  # 存储语言成绩详情
    标准化考试 = db.Column(db.JSON)  # 存储GRE/GMAT等成绩
    录取结果 = db.Column(db.Boolean)
    创建时间 = db.Column(db.DateTime, default=datetime.utcnow)

class 个人陈述(db.Model):
    __tablename__ = '个人陈述表'
    
    id = db.Column(db.Integer, primary_key=True)
    用户id = db.Column(db.Integer, db.ForeignKey('用户表.id'))
    标题 = db.Column(db.String(200))
    内容 = db.Column(db.Text)
    分析结果 = db.Column(db.JSON)  # 存储AI分析结果
    创建时间 = db.Column(db.DateTime, default=datetime.utcnow)
    更新时间 = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class 文书模板(db.Model):
    __tablename__ = '文书模板表'
    
    id = db.Column(db.Integer, primary_key=True)
    标题 = db.Column(db.String(100), nullable=False)
    类别 = db.Column(db.String(50), nullable=False)
    内容 = db.Column(db.Text, nullable=False)
    描述 = db.Column(db.Text)
    标签 = db.Column(db.JSON)  # 存储标签列表
    使用次数 = db.Column(db.Integer, default=0)
    是否高级模板 = db.Column(db.Boolean, default=False)
    创建时间 = db.Column(db.DateTime, default=datetime.utcnow)
    更新时间 = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class 用户活动日志(db.Model):
    __tablename__ = '用户活动日志表'
    
    id = db.Column(db.Integer, primary_key=True)
    用户id = db.Column(db.Integer, db.ForeignKey('用户表.id'))
    活动类型 = db.Column(db.String(50))
    活动详情 = db.Column(db.JSON)
    创建时间 = db.Column(db.DateTime, default=datetime.utcnow)
