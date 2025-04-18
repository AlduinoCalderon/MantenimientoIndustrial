import requests
from datetime import datetime
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
import emoji
import random
import string

# Configuración de la API
API_BASE_URL = 'http://localhost:3000/api'
AUTH_CREDENTIALS = {
    'email': 'carlos.mendez@empresa.com',
    'contraseña': 'carlos123'
}

# Inicializar la consola de rich
console = Console()

def generate_unique_email(base_email):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_str = ''.join(random.choices(string.ascii_lowercase, k=4))
    return f"{base_email.split('@')[0]}_{timestamp}_{random_str}@{base_email.split('@')[1]}"

def generate_unique_name(base_name):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_str = ''.join(random.choices(string.ascii_lowercase, k=4))
    return f"{base_name} {timestamp} {random_str}"

def generate_unique_ticket_name():
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_str = ''.join(random.choices(string.ascii_lowercase, k=6))
    return f'tickets/recarga_{timestamp}_{random_str}.jpg'

def print_header():
    console.print(Panel.fit(
        emoji.emojize(":wrench: Insertando Datos de Prueba :factory: :gear:"),
        style="bold blue"
    ))

def print_success(message):
    console.print(f":white_check_mark: {message}", style="green")

def print_error(message):
    console.print(f":x: {message}", style="red")

def print_info(message):
    console.print(f":information_source: {message}", style="blue")

def print_table(title, headers, rows):
    table = Table(title=title)
    for header in headers:
        table.add_column(header)
    for row in rows:
        table.add_row(*[str(item) for item in row])
    console.print(table)

def get_auth_token():
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/iniciar-sesion",
            json=AUTH_CREDENTIALS
        )
        if response.status_code == 200:
            return response.json()['data']['token']
        else:
            print_error(f"Error al obtener token: {response.json()['message']}")
            return None
    except Exception as e:
        print_error(f"Error de conexión: {str(e)}")
        return None

def insert_usuarios(token):
    headers = {'Authorization': f'Bearer {token}'}
    usuarios = [
        {
            'nombre': generate_unique_name('Carlos Méndez'),
            'email': generate_unique_email('carlos.mendez@empresa.com'),
            'contraseña': 'carlos123',
            'rol': 'Administrador'
        },
        {
            'nombre': generate_unique_name('Ana Torres'),
            'email': generate_unique_email('ana.torres@empresa.com'),
            'contraseña': 'ana123',
            'rol': 'Trabajador'
        }
    ]
    
    for usuario in usuarios:
        response = requests.post(
            f"{API_BASE_URL}/usuarios",
            json=usuario,
            headers=headers
        )
        if response.status_code == 201:
            print_success(f"Usuario {usuario['nombre']} creado correctamente")
        else:
            print_error(f"Error al crear usuario {usuario['nombre']}: {response.json()['message']}")

def insert_clientes(token):
    headers = {'Authorization': f'Bearer {token}'}
    clientes = [
        {
            'nombre': generate_unique_name('Industrias del Valle'),
            'email': generate_unique_email('contacto@industriasdelvalle.com'),
            'contraseña': 'industrias123',
            'contacto': generate_unique_name('Roberto Sánchez'),
            'empresa': generate_unique_name('Industrias del Valle S.A. de C.V.')
        },
        {
            'nombre': generate_unique_name('Maquinaria Pesada Oaxaca'),
            'email': generate_unique_email('ventas@maquinariaoaxaca.com'),
            'contraseña': 'maquinaria123',
            'contacto': generate_unique_name('Laura Martínez'),
            'empresa': generate_unique_name('Maquinaria Pesada Oaxaca S.A. de C.V.')
        }
    ]
    
    cliente_ids = []
    for cliente in clientes:
        response = requests.post(
            f"{API_BASE_URL}/clientes",
            json=cliente,
            headers=headers
        )
        if response.status_code == 201:
            cliente_id = response.json()['data']['id']
            cliente_ids.append(cliente_id)
            print_success(f"Cliente {cliente['nombre']} creado correctamente con ID: {cliente_id}")
        else:
            print_error(f"Error al crear cliente {cliente['nombre']}: {response.json()['message']}")
            if 'error' in response.json():
                print_error(f"Detalles: {response.json()['error']}")
    return cliente_ids

def insert_equipos(token, cliente_ids):
    headers = {'Authorization': f'Bearer {token}'}
    equipos = [
        {
            'nombre': generate_unique_name('Torno CNC'),
            'descripcion': f'Torno de control numérico para piezas de precisión {datetime.now().strftime("%Y%m%d%H%M%S")}',
            'cliente_id': cliente_ids[0] if cliente_ids else 1
        },
        {
            'nombre': generate_unique_name('Fresadora Vertical'),
            'descripcion': f'Fresadora para trabajos de precisión en metal {datetime.now().strftime("%Y%m%d%H%M%S")}',
            'cliente_id': cliente_ids[0] if cliente_ids else 1
        },
        {
            'nombre': generate_unique_name('Máquina de Soldadura'),
            'descripcion': f'Equipo de soldadura automática {datetime.now().strftime("%Y%m%d%H%M%S")}',
            'cliente_id': cliente_ids[1] if len(cliente_ids) > 1 else 2
        }
    ]
    
    equipo_ids = []
    for equipo in equipos:
        response = requests.post(
            f"{API_BASE_URL}/equipos",
            json=equipo,
            headers=headers
        )
        if response.status_code == 201:
            equipo_id = response.json()['data']['id']
            equipo_ids.append(equipo_id)
            print_success(f"Equipo {equipo['nombre']} creado correctamente con ID: {equipo_id}")
        else:
            print_error(f"Error al crear equipo {equipo['nombre']}: {response.json()['message']}")
            if 'error' in response.json():
                print_error(f"Detalles: {response.json()['error']}")
    return equipo_ids

def insert_vehiculos(token):
    headers = {'Authorization': f'Bearer {token}'}
    vehiculos = [
        {
            'modelo': generate_unique_name('Pickup Ford F-150'),
            'placas': f"ABC{random.randint(100, 999)}"
        },
        {
            'modelo': generate_unique_name('Camioneta Chevrolet Silverado'),
            'placas': f"XYZ{random.randint(100, 999)}"
        }
    ]
    
    vehiculo_ids = []
    for vehiculo in vehiculos:
        response = requests.post(
            f"{API_BASE_URL}/vehiculos",
            json=vehiculo,
            headers=headers
        )
        if response.status_code == 201:
            vehiculo_id = response.json()['data']['id']
            vehiculo_ids.append(vehiculo_id)
            print_success(f"Vehículo {vehiculo['modelo']} creado correctamente con ID: {vehiculo_id}")
        else:
            print_error(f"Error al crear vehículo {vehiculo['modelo']}: {response.json()['message']}")
            if 'error' in response.json():
                print_error(f"Detalles: {response.json()['error']}")
    return vehiculo_ids

def insert_reportes_mantenimiento(token, equipo_ids, usuario_id):
    headers = {'Authorization': f'Bearer {token}'}
    reportes = [
        {
            'equipo_id': equipo_ids[0] if equipo_ids else 1,
            'descripcion': f'Mantenimiento preventivo del torno CNC {datetime.now().strftime("%Y%m%d%H%M%S")}',
            'tipo': 'Preventivo',
            'evidencias': f'evidencias/mantenimiento_{datetime.now().strftime("%Y%m%d%H%M%S")}.jpg',
            'usuario_id': usuario_id
        },
        {
            'equipo_id': equipo_ids[1] if len(equipo_ids) > 1 else 2,
            'descripcion': f'Reparación de la fresadora vertical {datetime.now().strftime("%Y%m%d%H%M%S")}',
            'tipo': 'Correctivo',
            'evidencias': f'evidencias/mantenimiento_{datetime.now().strftime("%Y%m%d%H%M%S")}.jpg',
            'usuario_id': usuario_id
        }
    ]
    
    for reporte in reportes:
        response = requests.post(
            f"{API_BASE_URL}/reportes-mantenimiento",
            json=reporte,
            headers=headers
        )
        if response.status_code == 201:
            reporte_id = response.json()['data']['id']
            print_success(f"Reporte de mantenimiento creado correctamente con ID: {reporte_id}")
        else:
            print_error(f"Error al crear reporte de mantenimiento: {response.json()['message']}")
            if 'error' in response.json():
                print_error(f"Detalles: {response.json()['error']}")

def insert_recargas_combustible(token, vehiculo_ids, usuario_id):
    headers = {'Authorization': f'Bearer {token}'}
    recargas = [
        {
            'vehiculo_id': vehiculo_ids[0] if vehiculo_ids else 1,
            'kilometraje': random.randint(50000, 100000),
            'cantidad': round(random.uniform(20.0, 60.0), 2),
            'gasolinera': generate_unique_name('Gasolinera Pemex'),
            'foto_ticket': generate_unique_ticket_name(),
            'usuario_id': usuario_id
        },
        {
            'vehiculo_id': vehiculo_ids[1] if len(vehiculo_ids) > 1 else 2,
            'kilometraje': random.randint(50000, 100000),
            'cantidad': round(random.uniform(20.0, 60.0), 2),
            'gasolinera': generate_unique_name('Gasolinera BP'),
            'foto_ticket': generate_unique_ticket_name(),
            'usuario_id': usuario_id
        }
    ]
    
    for recarga in recargas:
        response = requests.post(
            f"{API_BASE_URL}/recargas-combustible",
            json=recarga,
            headers=headers
        )
        if response.status_code == 201:
            recarga_id = response.json()['data']['id']
            print_success(f"Recarga de combustible creada correctamente con ID: {recarga_id}")
        else:
            print_error(f"Error al crear recarga de combustible: {response.json()['message']}")
            if 'error' in response.json():
                print_error(f"Detalles: {response.json()['error']}")

def main():
    print_header()
    
    # Obtener token de autenticación
    token = get_auth_token()
    if not token:
        return
    
    try:
        # Insertar usuarios y obtener el ID del usuario administrador
        print_info("\n=== Insertando Usuarios ===")
        insert_usuarios(token)
        
        # Obtener el ID del usuario administrador
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get(f"{API_BASE_URL}/usuarios", headers=headers)
        if response.status_code == 200:
            usuarios = response.json()['data']
            admin_id = next((u['id'] for u in usuarios if u['rol'] == 'Administrador'), None)
            if not admin_id:
                print_error("No se encontró un usuario administrador")
                return
        else:
            print_error("Error al obtener usuarios")
            return
        
        # Insertar clientes y obtener sus IDs
        print_info("\n=== Insertando Clientes ===")
        cliente_ids = insert_clientes(token)
        
        # Insertar equipos usando los IDs de los clientes
        print_info("\n=== Insertando Equipos ===")
        equipo_ids = insert_equipos(token, cliente_ids)
        
        # Insertar vehículos y obtener sus IDs
        print_info("\n=== Insertando Vehículos ===")
        vehiculo_ids = insert_vehiculos(token)
        
        # Insertar reportes de mantenimiento usando los IDs de los equipos y el usuario
        print_info("\n=== Insertando Reportes de Mantenimiento ===")
        insert_reportes_mantenimiento(token, equipo_ids, admin_id)
        
        # Insertar recargas de combustible usando los IDs de los vehículos y el usuario
        print_info("\n=== Insertando Recargas de Combustible ===")
        insert_recargas_combustible(token, vehiculo_ids, admin_id)
        
    except Exception as e:
        print_error(f"Error durante la inserción de datos: {str(e)}")

if __name__ == "__main__":
    main()