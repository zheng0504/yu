import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app
import jwt
from datetime import datetime, timedelta

def generate_verification_token(email):
    """生成验证令牌"""
    token = jwt.encode(
        {
            'email': email,
            'exp': datetime.utcnow() + timedelta(hours=24)
        },
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    return token

def verify_token(token):
    """验证令牌"""
    try:
        data = jwt.decode(
            token,
            current_app.config['SECRET_KEY'],
            algorithms=['HS256']
        )
        return data['email']
    except:
        return None

def send_verification_email(to_email, token):
    """发送验证邮件"""
    msg = MIMEMultipart()
    msg['From'] = current_app.config['MAIL_USERNAME']
    msg['To'] = to_email
    msg['Subject'] = "验证您的邮箱地址"

    verification_link = f"{current_app.config['FRONTEND_URL']}/verify-email?token={token}"
    
    body = f"""
    <html>
        <body>
            <h2>欢迎注册留学选校 AI 辅助系统！</h2>
            <p>请点击下面的链接验证您的邮箱地址：</p>
            <p><a href="{verification_link}">{verification_link}</a></p>
            <p>此链接将在24小时后失效。</p>
            <p>如果您没有注册我们的系统，请忽略此邮件。</p>
        </body>
    </html>
    """
    
    msg.attach(MIMEText(body, 'html'))

    try:
        server = smtplib.SMTP(current_app.config['MAIL_SERVER'], current_app.config['MAIL_PORT'])
        server.starttls()
        server.login(current_app.config['MAIL_USERNAME'], current_app.config['MAIL_PASSWORD'])
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"发送邮件失败: {str(e)}")
        return False
