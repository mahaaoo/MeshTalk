const zh = {
  header_back_title: "返回",
  alert_title_text: "提示",
  alert_cancel_text: "取消",
  alert_confim_text: "确定",

  tabbar_icon_home: "主页",
  tabbar_icon_public: "跨站",
  tabbar_icon_new: "新嘟文",
  tabbar_icon_notify: "通知",
  tabbar_icon_setting: "设置",

  tabbar_icon_notify_null: "暂时没有通知",

  screen_load_error_text: "出错了,刷新试试",
  page_welcome_text: "欢迎来到MeshTalk",
  page_welcome_more: "寻找更多的实例",
  page_has_account: "已有账号？",
  page_account_login: "登录",

  page_login_cancel: "取消",
  page_login_title: "登录Mastodon",
  page_login_server_placeholder: "应用实例地址",
  page_login_text: "登录",

  page_server_title: "实例列表",
  page_server_detail_title: "实例详情",
  page_status_detail: "详情",

  home_tabview_title1: "推荐",
  home_tabview_title2: "正在关注",

  // status_tool_bar_turn: "转发",
  // status_tool_bar_comment: "转评",
  // status_tool_bar_like: "喜欢",

  status_turn: "转发了",
  status_comment: "转评了",

  status_origin: "来自",

  status_time_days: "天前",
  status_time_hours: "小时前",
  status_time_minutes: "分钟前",
  status_time_now: "刚刚",

  status_options_item_delete: "删除该条嘟文",

  status_options_item_unfollow: "取消关注该用户",
  status_options_item_follow: "关注该用户",

  status_options_item_mention: "提及",

  status_options_item_copy_link: "复制嘟文链接",
  status_options_item_open_link: "在浏览器中打开",

  status_options_item_pin: "置顶",
  status_options_item_unpin: "取消置顶",

  status_options_item_mute: "屏蔽",
  status_options_item_unmute: "取消屏蔽",

  status_options_item_block: "拉黑",
  status_options_item_unblock: "取消拉黑",

  status_options_item_report: "举报",

  setting_like: "喜欢",
  setting_bookmark: "书签",
  setting_mute: "屏蔽",
  setting_block: "拉黑",
  setting_announce: "站点公告",
  setting_lanuage: "语言",
  setting_logout: "退出/切换账号",
  setting_tag: "话题标签",

  user_post: "嘟文",
  user_folloing: "正在关注",
  user_follower: "关注者",

  user_tabview_post: "嘟文",
  user_tabview_reply: "嘟文和回复",
  user_tabview_pin: "已置顶",
  user_tabview_media: "媒体",

  page_title_like: "喜欢的内容",
  page_title_bookmark: "书签",

  page_title_hashtag: "话题标签",
  page_hashtag_null: "没有话题标签",

  page_title_mute: "屏蔽列表",
  page_mute_null: "没有屏蔽任何人",

  page_title_block: "拉黑列表",
  page_block_null: "没有拉黑任何人",

  page_title_announce: "站点公告",

  new_status_goback_title: "取消",
  new_status_header_title: "新嘟文",
  new_status_header_submit: "发送",

  new_status_content_placeholder: "有什么新鲜事",
  new_status_warning_placeholder: "警告信息",

  new_status_ares_title: "谁能回复？",
  new_status_ares_public: "公开",
  new_status_ares_unlist: "不出现在公共时间线",
  new_status_ares_follow_only: "仅关注者可见",
  new_status_ares_direct: "仅提及的人可见",
  new_status_ares_cancel: "取消",

  switch_account_add: "添加已有账号",
  switch_account_logout: "退出当前账号",
  switch_account_cancel: "取消",
  switch_account_alert: "退出当前账号，下次需要重新登录",

  pic_save_text: "保存图片",
  pic_share_text: "分享图片",
  pic_cancel_text: "取消",

  edit_info_header_title: "编辑个人资料",
  edit_info_reset: "重置",
  edit_info_reset_alert: "确定要重置内容？",
  edit_info_display_name: "昵称",
  edit_info_display_name_placeholder: "输入昵称",
  edit_info_note: "简介",
  edit_info_note_placeholder: "输入简介",
  edit_info_robot: "机器人",
  edit_info_robot_explain: "这个账户大多数操作时自动的，并且可能无人监控",
  edit_info_lock: "锁定",
  edit_info_lock_explain: "你需要手动审核所有的关注请求",
  edit_info_profile_metadata: "附加信息",
  edit_info_profile_metadata_explain: "将会在个人资料页上展示，最多4个内容",
  edit_info_profile_key: "描述",
  edit_info_profile_value: "内容",
  edit_info_save: "保存",
  edit_info_delete_metadata_alert: "确定要删除该条内容？",

  page_title_following: "正在关注",
  page_title_following_null: "暂无正在关注",

  page_title_follower: "关注者",
  page_title_follower_null: "暂无关注者",

  follow_button_requesting: "请求中",
  follow_button_request_follow: "请求关注",
  follow_button_follow: "关注",
  follow_button_following: "正在关注",
  follow_button_mutual: "互相关注",
  follow_button_waiting: "等待通过",

  refresh_list_foot_text: "数据加载中…",
  refresh_list_foot_fail_text: "点击重新加载",
  refresh_list_foot_nomore_text: "已加载全部数据",

  meida_sensitive_text: "可能涉及敏感内容",
  meida_sensitive_show: "显示",

  html_content_sensitive_show: "点击查看",

  server_card_login_text: "登录实例",
  server_card_create_text: "创建账号",
  server_card_apply_text: "申请账号",

  announce_read_button_text: "已读",

  hash_tag_describe: (days: number, accounts: number, uses: number) => `过去${days}天,共有${accounts}个用户使用${uses}次`,

  hash_info_follow_text: "关注",
  hash_info_following_text: "正在关注",
};
export default zh;
