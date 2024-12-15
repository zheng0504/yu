from flask import Blueprint, request, jsonify
from app.models.数据库模型 import 用户
from app import db
from app.utils.email import generate_verification_token, verify_token, send_verification_email
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from datetime import timedelta

bp = Blueprint('认证', __name__)

@bp.route('/api/注册', methods=['POST'])
def 注册():
    数据 = request.get_json()
    
    # 检查用户名是否已存在
    if 用户.query.filter_by(用户名=数据['用户名']).first():
        return jsonify({'message': '用户名已存在'}), 400
    
    # 检查邮箱是否已存在
    if 用户.query.filter_by(邮箱=数据['邮箱']).first():
        return jsonify({'message': '邮箱已被注册'}), 400
    
    # 创建新用户
    新用户 = 用户(
        用户名=数据['用户名'],
        邮箱=数据['邮箱']
    )
    新用户.设置密码(数据['密码'])
    
    db.session.add(新用户)
    db.session.commit()
    
    # 生成验证令牌并发送验证邮件
    token = generate_verification_token(数据['邮箱'])
    if send_verification_email(数据['邮箱'], token):
        return jsonify({
            'success': True,
            'message': '注册成功，请查收验证邮件'
        })
    else:
        return jsonify({
            'success': False,
            'message': '注册成功，但发送验证邮件失败，请联系管理员'
        }), 500

@bp.route('/api/验证邮箱', methods=['POST'])
def 验证邮箱():
    数据 = request.get_json()
    邮箱 = verify_token(数据['token'])
    
    if not 邮箱:
        return jsonify({
            'success': False,
            'message': '无效或已过期的验证链接'
        }), 400
    
    用户实例 = 用户.query.filter_by(邮箱=邮箱).first()
    if not 用户实例:
        return jsonify({
            'success': False,
            'message': '用户不存在'
        }), 404
    
    用户实例.是否验证邮箱 = True
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': '邮箱验证成功'
    })

@bp.route('/api/登录', methods=['POST'])
def 登录():
    数据 = request.get_json()
    用户实例 = 用户.query.filter_by(用户名=数据['用户名']).first()
    
    if not 用户实例 or not 用户实例.验证密码(数据['密码']):
        return jsonify({'message': '用户名或密码错误'}), 401
    
    if not 用户实例.是否验证邮箱:
        return jsonify({'message': '请先验证您的邮箱'}), 401
    
    # 创建访问令牌
    token = create_access_token(
        identity=用户实例.id,
        expires_delta=timedelta(days=1)
    )
    
    return jsonify({
        'token': token,
        'user': {
            'id': 用户实例.id,
            'username': 用户实例.用户名,
            'email': 用户实例.邮箱,
            'is_premium': 用户实例.是否高级会员
        }
    })

@bp.route('/api/用户信息', methods=['GET'])
@jwt_required()
def 获取用户信息():
    用户id = get_jwt_identity()
    用户实例 = 用户.query.get(用户id)
    
    if not 用户实例:
        return jsonify({'message': '用户不存在'}), 404
    
    return jsonify({
        'id': 用户实例.id,
        'username': 用户实例.用户名,
        'email': 用户实例.邮箱,
        'is_premium': 用户实例.是否高级会员
    })
