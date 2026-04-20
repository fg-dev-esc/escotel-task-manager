import {
  FolderOutlined,
  FileOutlined,
  ProjectOutlined,
  TeamOutlined,
  ShopOutlined,
  BookOutlined,
  HeartOutlined,
  StarOutlined,
  BulbOutlined,
  RocketOutlined,
  BankOutlined,
  HomeOutlined,
  LaptopOutlined,
  CodeOutlined,
  BugOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'

export const iconOptions = [
  { label: 'Carpeta', value: 'FolderOutlined', icon: FolderOutlined },
  { label: 'Archivo', value: 'FileOutlined', icon: FileOutlined },
  { label: 'Proyecto', value: 'ProjectOutlined', icon: ProjectOutlined },
  { label: 'Equipo', value: 'TeamOutlined', icon: TeamOutlined },
  { label: 'Tienda', value: 'ShopOutlined', icon: ShopOutlined },
  { label: 'Libro', value: 'BookOutlined', icon: BookOutlined },
  { label: 'Corazón', value: 'HeartOutlined', icon: HeartOutlined },
  { label: 'Estrella', value: 'StarOutlined', icon: StarOutlined },
  { label: 'Bombilla', value: 'BulbOutlined', icon: BulbOutlined },
  { label: 'Cohete', value: 'RocketOutlined', icon: RocketOutlined },
  { label: 'Banco', value: 'BankOutlined', icon: BankOutlined },
  { label: 'Casa', value: 'HomeOutlined', icon: HomeOutlined },
  { label: 'Laptop', value: 'LaptopOutlined', icon: LaptopOutlined },
  { label: 'Código', value: 'CodeOutlined', icon: CodeOutlined },
  { label: 'Bug', value: 'BugOutlined', icon: BugOutlined },
  { label: 'Verificado', value: 'CheckCircleOutlined', icon: CheckCircleOutlined },
]

export function getIconComponent(iconName) {
  const iconOption = iconOptions.find(opt => opt.value === iconName)
  if (iconOption) {
    return iconOption.icon
  }
  return FolderOutlined
}
