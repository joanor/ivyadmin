export interface Menu {
  menuId: string
  icon: string
  menuName: string
  children: Menu[]
}

export const menuList: Menu[] = [
  {
    menuId: 'dashboard',
    icon: 'user_overview',
    menuName: '用户概览',
    children: [],
  },
  {
    menuId: 'analysis',
    icon: 'energy_analysis',
    menuName: '用能分析',
    children: [
      {
        menuId: 'home',
        icon: '',
        menuName: '用能分析',
        children: [],
      },
      {
        menuId: 'energy_system_diagram',
        icon: '',
        menuName: '能源系统图',
        children: [],
      },
      {
        menuId: 'analysis_report',
        icon: '',
        menuName: '分析报告',
        children: [],
      },
    ],
  },
  // {
  //   menuId: 'app_carbon_esmission_monitor',
  //   icon: 'carbon_esmission_monitor',
  //   menuName: '碳排放监测',
  //   children: [
  //     {
  //       menuId: '',
  //       icon: '',
  //       menuName: '',
  //       children: [],
  //     },
  //   ],
  // },
  // {
  //   menuId: 'app_energy_storage',
  //   menuName: '光伏储能',
  //   icon: 'energy_storage',
  //   children: [
  //     {
  //       menuId: 'overview',
  //       icon: '',
  //       menuName: '概览',
  //       children: [],
  //     },
  //     {
  //       menuId: 'device_manager',
  //       icon: '',
  //       menuName: '设备管理',
  //       children: [],
  //     },
  //     {
  //       menuId: 'energy_storage_system',
  //       icon: '',
  //       menuName: '储能系统',
  //       children: [],
  //     },
  //   ],
  // },
  // {
  //   menuId: 'app_equipment_monitor',
  //   icon: 'equipment_monitor',
  //   menuName: '设备监控',
  //   children: [
  //     {
  //       menuId: 'power_distribution_monitor',
  //       icon: '',
  //       menuName: '配电房监控',
  //       children: [],
  //     },
  //     {
  //       menuId: 'video_monitor',
  //       icon: '',
  //       menuName: '视频监控',
  //       children: [],
  //     },
  //     {
  //       menuId: 'air_container_monitor',
  //       icon: '',
  //       menuName: '空调监控',
  //       children: [],
  //     },
  //     {
  //       menuId: 'illumination_monitor',
  //       icon: '',
  //       menuName: '照明监控',
  //       children: [],
  //     },
  //   ],
  // },
  {
    menuId: 'app_om_manager',
    menuName: '运行管理',
    icon: 'om_manager',
    children: [
      {
        menuId: 'equip_run_manager',
        icon: '',
        menuName: '设备运行管理',
        children: [],
      },
      {
        menuId: 'equip_files_deploy',
        icon: '',
        menuName: '设备档案配置',
        children: [
          {
            menuId: 'gaugeTableDetails',
            icon: '',
            menuName: '表计明细',
            children: [],
          },
        ],
      },
      {
        menuId: 'batch_issue',
        icon: '',
        menuName: '批量下发',
        children: [],
      },
      {
        menuId: 'collect_task_deploy',
        icon: '',
        menuName: '任务配置',
        children: [],
      },
      {
        menuId: 'task_plan',
        icon: '',
        menuName: '任务方案',
        children: [],
      },
      {
        menuId: 'query_message',
        icon: '',
        menuName: '报文查询',
        children: [],
      },
      {
        menuId: 'commMode_record',
        icon: '',
        menuName: '通信记录',
        children: [],
      },
      {
        menuId: 'terminal_params_deploy',
        icon: '',
        menuName: '终端参数配置',
        children: [],
      },
      {
        menuId: 'data_called',
        icon: '',
        menuName: '数据召测',
        children: [],
      },
    ],
  },
  {
    menuId: 'app_data_manager',
    menuName: '数据管理',
    icon: 'data_manager',
    children: [
      {
        menuId: 'dataDaySearch',
        icon: '',
        menuName: '数据日查询',
        children: [],
      },
      {
        menuId: 'dataCurveSearch',
        icon: '',
        menuName: '数据曲线查询',
        children: [],
      },
      {
        menuId: 'successRate',
        icon: '',
        menuName: '采集成功率',
        children: [],
      },
      {
        menuId: 'dataReCollection',
        icon: '',
        menuName: '数据补采',
        children: [],
      },
    ],
  },
  // {
  //   menuId: 'app_notification_manager',
  //   menuName: '通知管理',
  //   icon:'notification_manager',
  //   children: [
  //     {
  //       menuId: 'alert_release',
  //       icon:'',
  //       menuName: '告警发布',
  //       children: []
  //     },
  //     {
  //       menuId: 'abnormal_alarm',
  //       icon:'',
  //       menuName: '异常告警',
  //       children: []
  //     },
  //     {
  //       menuId: 'alert_rules',
  //       icon:'',
  //       menuName: '告警规则',
  //       children: []
  //     },
  //   ]
  // },
  {
    menuId: 'app_device_manager',
    menuName: '设备管理',
    icon: 'device_manager',
    children: [
      // {
      //   menuId: 'home',
      //   icon: '',
      //   menuName: '概览',
      //   children: [],
      // },
      {
        menuId: 'aelectricityMeter',
        icon: '',
        menuName: '电表',
        children: [],
      },
      {
        menuId: 'waterMeter',
        icon: '',
        menuName: '水表',
        children: [],
      },
      {
        menuId: 'gasMeter',
        icon: '',
        menuName: '气表',
        children: [],
      },
      {
        menuId: 'tmnl',
        icon: '',
        menuName: '采集终端',
        children: [],
      },
      {
        menuId: 'iot',
        icon: '',
        menuName: '智能设备',
        children: [],
      },
    ],
  },
  {
    menuId: 'app_system_manager',
    icon: 'system_manager',
    menuName: '系统管理',
    children: [
      {
        menuId: 'organizations',
        icon: '',
        menuName: '组织管理',
        children: [],
      },
      {
        menuId: 'regions',
        icon: '',
        menuName: '企业管理',
        children: [],
      },
      // {
      //   menuId: 'users',
      //   icon:'',
      //   menuName: '用户管理',
      //   children: []
      // },
      // {
      //   menuId: 'roles',
      //   icon:'',
      //   menuName: '角色管理',
      //   children: []
      // },
      {
        menuId: 'fields',
        icon: '',
        menuName: '字段管理',
        children: [],
      },
    ],
  },
]
