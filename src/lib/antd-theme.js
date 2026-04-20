import { theme as antdTheme } from 'antd'

const { darkAlgorithm, defaultAlgorithm } = antdTheme

// Design Tokens for "Enterprise Cutting Edge"
const tokens = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFamilyCode: "'JetBrains Mono', 'Fira Code', monospace",
  borderRadius: 4, // Sharper, more professional
}

export const lightTheme = {
  algorithm: defaultAlgorithm,
  token: {
    ...tokens,
    colorPrimary: '#000000', // Minimalist black primary
    colorBgBase: '#FFFFFF',
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorBorder: 'rgba(0, 0, 0, 0.08)',
    colorBorderSecondary: 'rgba(0, 0, 0, 0.04)',
    colorText: '#111111',
    colorTextSecondary: '#666666',
    colorTextDescription: '#888888',
    colorInfo: '#000000',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
  },
  components: {
    Layout: {
      headerBg: 'rgba(255, 255, 255, 0.7)',
      siderBg: '#FFFFFF',
      bodyBg: '#FFFFFF',
    },
    Button: {
      fontWeight: 500,
      controlHeight: 36,
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: 'rgba(0, 0, 0, 0.04)',
      itemSelectedColor: '#000000',
    },
    Card: {
      colorBorderSecondary: 'rgba(0, 0, 0, 0.06)',
    },
    Table: {
      headerBg: '#FFFFFF',
      headerColor: '#111111',
      rowHoverBg: '#F5F5F5',
    },
    Select: {
      controlItemBgHover: '#F5F5F5',
      controlItemBgActive: '#F5F5F5',
      optionPadding: '5px 12px',
    },
    Dropdown: {
      controlItemBgHover: '#F5F5F5',
      controlItemBgActive: '#F5F5F5',
    }
  },
}

export const darkTheme = {
  algorithm: darkAlgorithm,
  token: {
    ...tokens,
    colorPrimary: '#FFFFFF', // Minimalist white primary in dark mode
    colorBgBase: '#000000',   // Pitch black as seen in reference
    colorBgContainer: '#0A0A0A',
    colorBgElevated: '#121212',
    colorBorder: 'rgba(255, 255, 255, 0.08)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.04)',
    colorText: '#FFFFFF',
    colorTextSecondary: 'rgba(255, 255, 255, 0.6)',
    colorTextDescription: 'rgba(255, 255, 255, 0.4)',
    colorInfo: '#FFFFFF',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
  },
  components: {
    Layout: {
      headerBg: 'rgba(0, 0, 0, 0.7)',
      siderBg: '#050505',
      bodyBg: '#000000',
    },
    Button: {
      fontWeight: 500,
      controlHeight: 36,
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: 'rgba(255, 255, 255, 0.08)',
      itemSelectedColor: '#FFFFFF',
    },
    Card: {
      colorBorderSecondary: 'rgba(255, 255, 255, 0.06)',
    }
  },
}
