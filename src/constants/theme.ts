export const colors = {
    navy950:'#071426', navy900:'#0B1D33', navy800:'#112B47', navy700:'#173A5E',
    blue600:'#1A5FB4', blue500:'#2E86DE', blue100:'#E8F1FB', blue50:'#F3F8FD',
    green600:'#1E8449', green500:'#27AE60', green100:'#E6F7EE',
    amber600:'#B9770E', amber500:'#F39C12', amber100:'#FEF3E2',
    purple600:'#6C3483', purple500:'#8E44AD', purple100:'#F3E8F8',
    red600:'#B03A2E', red500:'#E74C3C', red100:'#FDECEA',
    white:'#FFFFFF', background:'#F5F7FA', surface:'#FFFFFF', surfaceMuted:'#EEF2F7',
    border:'#E2E8F0', divider:'#EDF1F7',
    textPrimary:'#0B1D33', textSecondary:'#4A5A6E', textMuted:'#8393A7',
    textOnDark:'#FFFFFF', textOnDarkMuted:'#B8C7D9',
  } as const;
  
  export const spacing = { xs:4, sm:8, md:12, lg:16, xl:20, '2xl':24, '3xl':32, '4xl':40 } as const;
  export const radius = { sm:8, md:12, lg:16, xl:20, '2xl':24, full:999 } as const;
  
  export const typography = {
    display:{fontSize:28,fontWeight:'800' as const,letterSpacing:-0.5},
    h1:{fontSize:24,fontWeight:'700' as const,letterSpacing:-0.3},
    h2:{fontSize:20,fontWeight:'700' as const,letterSpacing:-0.2},
    h3:{fontSize:17,fontWeight:'600' as const},
    body:{fontSize:15,fontWeight:'400' as const,lineHeight:22},
    bodyMedium:{fontSize:15,fontWeight:'500' as const,lineHeight:22},
    caption:{fontSize:13,fontWeight:'400' as const,lineHeight:18},
    label:{fontSize:12,fontWeight:'600' as const,letterSpacing:0.4},
    tiny:{fontSize:11,fontWeight:'500' as const},
  } as const;
  
  export const shadows = {
    card:{shadowColor:'#0B1D33',shadowOffset:{width:0,height:4},shadowOpacity:0.06,shadowRadius:12,elevation:2},
    elevated:{shadowColor:'#0B1D33',shadowOffset:{width:0,height:8},shadowOpacity:0.1,shadowRadius:20,elevation:5},
  } as const;
  
  export const statusColors = {
    'Aktif':{bg:colors.green100,fg:colors.green600,dot:colors.green500},
    'Ditutup':{bg:colors.red100,fg:colors.red600,dot:colors.red500},
    'Menunggu Seleksi':{bg:colors.amber100,fg:colors.amber600,dot:colors.amber500},
    'Diterima':{bg:colors.green100,fg:colors.green600,dot:colors.green500},
    'Ditolak':{bg:colors.red100,fg:colors.red600,dot:colors.red500},
  } as const;