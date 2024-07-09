#!/bin/bash  
  
# 提示用户输入更新消息  
read -p "请输入更新消息: " message  
  
# 使用用户输入的消息执行eas update命令  
eas update --branch production --message "$message"  
  
# 如果eas update命令执行成功，echo一条成功消息（可选）  
echo "更新命令已执行，消息为：$message"