import { db } from '../src/lib/firebase.js'
import { collection, setDoc, doc, addDoc } from 'firebase/firestore'

const PROYECTOS = [
  {
    name: 'SQL Injection',
    description: 'SQL injection and database exploits',
    color: '#FF4444',
    icon: 'BugOutlined',
    tareas: [
      {
        titulo: 'Research OWASP techniques',
        descripcion: 'Study OWASP top 10 SQL injection patterns',
        estado: 'done',
        prioridad: 'high',
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Build SQLmap integration',
        descripcion: 'Configure SQLmap and automate payload generation',
        estado: 'in_progress',
        prioridad: 'high',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Write bypass payloads',
        descripcion: 'Create WAF bypass and undetectable payloads',
        estado: 'in_progress',
        prioridad: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Security audit testing',
        descripcion: 'Test against real databases and report findings',
        estado: 'in_review',
        prioridad: 'medium',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Optimize detection speed',
        descripcion: 'Optimize query performance and reduce false positives',
        estado: 'todo',
        prioridad: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    name: 'Web Scraper Bot',
    description: 'Automated web data extraction from any site',
    color: '#FF8C42',
    icon: 'CrawlerOutlined',
    tareas: [
      {
        titulo: 'Setup BeautifulSoup environment',
        descripcion: 'Configure Python deps and proxy servers',
        estado: 'done',
        prioridad: 'high',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Handle JavaScript rendering',
        descripcion: 'Implement Selenium/Puppeteer for dynamic pages',
        estado: 'in_progress',
        prioridad: 'high',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Implement rate limiting',
        descripcion: 'Add rate limit and user-agent rotation',
        estado: 'todo',
        prioridad: 'medium',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Data storage and caching',
        descripcion: 'Store data in Redis and MongoDB for efficiency',
        estado: 'todo',
        prioridad: 'low',
        dueDate: null
      }
    ]
  },
  {
    name: 'DDoS Machine',
    description: 'Distributed denial of service tools and load tests',
    color: '#DC2626',
    icon: 'ThunderboltOutlined',
    tareas: [
      {
        titulo: 'Configure botnet nodes',
        descripcion: 'Setup various cloud data centers and CDNs',
        estado: 'done',
        prioridad: 'high',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Implement traffic flooding',
        descripcion: 'Code UDP/TCP flood and amplification',
        estado: 'in_progress',
        prioridad: 'high',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Add DNS amplification',
        descripcion: 'Leverage DNS servers for amplified attacks',
        estado: 'in_progress',
        prioridad: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Test load capacity',
        descripcion: 'Iterate load testing with increasing traffic',
        estado: 'in_review',
        prioridad: 'medium',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    name: 'Password Cracker',
    description: 'Brute force and dictionary attacks v2.0',
    color: '#9C27B0',
    icon: 'UnlockOutlined',
    tareas: [
      {
        titulo: 'Build dictionary compilation',
        descripcion: 'Collect and compress password dictionaries',
        estado: 'done',
        prioridad: 'high',
        dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Implement GPU acceleration',
        descripcion: 'Use CUDA and OpenCL for hash cracking',
        estado: 'in_progress',
        prioridad: 'high',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Rainbow table generation',
        descripcion: 'Generate pre-computed rainbow tables',
        estado: 'todo',
        prioridad: 'medium',
        dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Support multi-algorithm',
        descripcion: 'Add MD5, SHA, bcrypt, argon2 support',
        estado: 'todo',
        prioridad: 'medium',
        dueDate: null
      }
    ]
  },
  {
    name: 'Network Sniffer',
    description: 'Packet capture and analysis toolkit',
    color: '#03A9F4',
    icon: 'RadarChartOutlined',
    tareas: [
      {
        titulo: 'Setup Wireshark integration',
        descripcion: 'Configure libpcap and promiscuous mode',
        estado: 'done',
        prioridad: 'high',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Implement packet filtering',
        descripcion: 'Filter TCP/UDP packets by protocol and port',
        estado: 'in_progress',
        prioridad: 'high',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Decrypt SSL/TLS traffic',
        descripcion: 'Capture and decrypt SSL handshakes',
        estado: 'in_review',
        prioridad: 'medium',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Protocol analysis',
        descripcion: 'Analyze HTTP, FTP, SMTP, DNS traffic',
        estado: 'todo',
        prioridad: 'low',
        dueDate: null
      },
      {
        titulo: 'Real-time visualization',
        descripcion: 'Create dashboard for live packet view',
        estado: 'todo',
        prioridad: 'low',
        dueDate: null
      }
    ]
  },
  {
    name: 'XSS Payloads',
    description: 'Cross-site scripting vulnerabilities pools',
    color: '#FFD700',
    icon: 'AlertOutlined',
    tareas: [
      {
        titulo: 'Research mutation techniques',
        descripcion: 'Study DOM mutation and filter bypass methods',
        estado: 'done',
        prioridad: 'high',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Build payload generator',
        descripcion: 'Code XSS payload generator with OWASP filters',
        estado: 'in_progress',
        prioridad: 'high',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'DOM-based XSS testing',
        descripcion: 'Test React, Vue, Angular and other frameworks',
        estado: 'in_progress',
        prioridad: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Cookie exfiltration methods',
        descripcion: 'Steal session cookies and hidden data',
        estado: 'todo',
        prioridad: 'medium',
        dueDate: null
      }
    ]
  },
  {
    name: 'Phishing Campaign',
    description: 'Social engineering and phishing models',
    color: '#10B981',
    icon: 'MailOutlined',
    tareas: [
      {
        titulo: 'Create email templates',
        descripcion: 'Design convincing phishing email imitations',
        estado: 'done',
        prioridad: 'high',
        dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Setup landing pages',
        descripcion: 'Host fake login pages and credential harvesters',
        estado: 'in_progress',
        prioridad: 'high',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Domain spoofing',
        descripcion: 'Register look-alike domains and certificates',
        estado: 'in_review',
        prioridad: 'high',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Bulk email distribution',
        descripcion: 'Send campaigns with botlists and proxies',
        estado: 'todo',
        prioridad: 'medium',
        dueDate: null
      }
    ]
  },
  {
    name: 'Malware Lab',
    description: 'Reverse engineering and malware analysis',
    color: '#7C3AED',
    icon: 'ExperimentOutlined',
    tareas: [
      {
        titulo: 'Setup sandbox environment',
        descripcion: 'Allocate isolated VMs for safe malware experiments',
        estado: 'done',
        prioridad: 'high',
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Implement debugger hooks',
        descripcion: 'Use OllyDBG and IDA for dynamic analysis',
        estado: 'in_progress',
        prioridad: 'high',
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Reverse PE files',
        descripcion: 'Disassemble and analyze Windows portable executables',
        estado: 'in_progress',
        prioridad: 'medium',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'YARA signature creation',
        descripcion: 'Create YARA rules for malware detection',
        estado: 'todo',
        prioridad: 'low',
        dueDate: null
      }
    ]
  },
  {
    name: 'Encoding Tools',
    description: 'Base64, hex, cipher and obfuscation tools',
    color: '#00BCD4',
    icon: 'CodeOutlined',
    tareas: [
      {
        titulo: 'Base64 encoder/decoder',
        descripcion: 'Implement base64 and URL encoding/decoding',
        estado: 'done',
        prioridad: 'high',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Cipher toolkit (ROT13, Caesar)',
        descripcion: 'Add ROT13, Caesar, Vigenere and other ciphers',
        estado: 'done',
        prioridad: 'high',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'AES encryption layer',
        descripcion: 'Add AES-256 encrypt decrypt capability',
        estado: 'in_progress',
        prioridad: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Code obfuscation',
        descripcion: 'Obfuscate JavaScript and Python code',
        estado: 'in_review',
        prioridad: 'medium',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    name: 'Privilege Escalation',
    description: 'Root privilege escalation exploits and bypasses',
    color: '#EF4444',
    icon: 'RiseOutlined',
    tareas: [
      {
        titulo: 'Windows kernel exploits',
        descripcion: 'Exploit CVEs for immediate privilege escalation',
        estado: 'in_progress',
        prioridad: 'high',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Linux sudo bypass',
        descripcion: 'Exploit sudoers and sudoers misconfigurations',
        estado: 'in_progress',
        prioridad: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'Docker escape techniques',
        descripcion: 'Evade container isolation and see host',
        estado: 'in_review',
        prioridad: 'medium',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        titulo: 'File permission abuse',
        descripcion: 'Abuse setuid/sgid bits and sudo config',
        estado: 'todo',
        prioridad: 'medium',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
]

export async function crearProyectosHacker() {
  console.log('=== CREANDO 10 PROYECTOS HACKER CON TAREAS ===\n')

  try {
    for (const proyecto of PROYECTOS) {
      const projectRef = doc(collection(db, 'proyectos'), proyecto.name)
      
      await setDoc(projectRef, {
        name: proyecto.name,
        description: proyecto.description,
        color: proyecto.color,
        icon: proyecto.icon,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      console.log(`Proyecto creado: ${proyecto.name}`)

      const tareasColRef = collection(db, 'proyectos', proyecto.name, 'tareas')
      for (const tarea of proyecto.tareas) {
        await addDoc(tareasColRef, {
          titulo: tarea.titulo,
          descripcion: tarea.descripcion,
          estado: tarea.estado,
          prioridad: tarea.prioridad,
          dueDate: tarea.dueDate,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
      
      console.log(`  -> ${proyecto.tareas.length} tareas agregadas`)
    }

    console.log(`\n✓ Total: ${PROYECTOS.length} proyectos con ${PROYECTOS.reduce((sum, p) => sum + p.tareas.length, 0)} tareas creados`)

  } catch (error) {
    console.error('Error:', error.message)
  }
}

crearProyectosHacker().catch(console.error)
