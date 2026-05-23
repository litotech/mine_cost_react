def calcular_balance_metalurgico(datos):
    """
    Calcula el balance metalúrgico diario para una operación de oro.
    Recibe un diccionario con los datos ingresados por operación.
    """
    # Constante de conversión
    OZ_TROY_GR = 31.1035
    
    # 1. Cálculos de Entrada (Cabeza)
    tmh = datos['tmh_tratadas']
    humedad = datos['humedad_porcentaje']
    ley_cabeza = datos['ley_cabeza_au']
    
    tms = tmh * (1 - (humedad / 100))
    contenido_cabeza_gr = tms * ley_cabeza
    
    # 2. Concentración en Espiral
    ley_espiral = datos['espiral_ley_au']
    conc_espiral_tms = datos['espiral_conc_tms_dia']
    
    ratio_espiral = tms / conc_espiral_tms if conc_espiral_tms > 0 else 0
    contenido_espiral_oz = (ley_espiral * conc_espiral_tms) / OZ_TROY_GR
    
    # 3. Concentración en ICON 350
    ley_icon = datos['icon_ley_au']
    conc_icon_tms = datos['icon_conc_tms_dia']
    
    ratio_icon = tms / conc_icon_tms if conc_icon_tms > 0 else 0
    contenido_icon_oz = (ley_icon * conc_icon_tms) / OZ_TROY_GR
    
    # 4. Concentración por Flotación
    ley_flotacion = datos['flotacion_ley_au']
    conc_flotacion_tms = datos['flotacion_conc_tms_dia']
    
    ratio_flotacion = tms / conc_flotacion_tms if conc_flotacion_tms > 0 else 0
    contenido_flotacion_oz = (ley_flotacion * conc_flotacion_tms) / OZ_TROY_GR
    
    # 5. Producción Diaria y Relave
    ley_relave = datos['ley_relave_au']
    
    # Producción en gramos (Suma de las onzas de los 3 circuitos convertidas a gramos)
    produccion_diaria_gr = (contenido_espiral_oz + contenido_icon_oz + contenido_flotacion_oz) * OZ_TROY_GR
    # Producción en onzas
    produccion_diaria_oz = produccion_diaria_gr / OZ_TROY_GR
    
    # 6. Recuperación Diaria (%)
    # Método 1: Por Contenido (Producción / Cabeza)
    recuperacion_por_contenido = (produccion_diaria_gr / contenido_cabeza_gr) * 100 if contenido_cabeza_gr > 0 else 0
    
    # Método 2: Por Leyes (Cabeza - Relave) / Cabeza
    recuperacion_por_leyes = ((ley_cabeza - ley_relave) / ley_cabeza) * 100 if ley_cabeza > 0 else 0
    
    # Retornar todos los resultados calculados
    resultados = {
        "Fecha": datos['fecha'],
        "Turno": datos['turno'],
        "TMS Tratadas": round(tms, 4),
        "Contenido Cabeza (gr)": round(contenido_cabeza_gr, 4),
        "Espiral": {
            "Ratio": round(ratio_espiral, 2),
            "Contenido (Oz)": round(contenido_espiral_oz, 4)
        },
        "ICON 350": {
            "Ratio": round(ratio_icon, 2),
            "Contenido (Oz)": round(contenido_icon_oz, 4)
        },
        "Flotación": {
            "Ratio": round(ratio_flotacion, 2),
            "Contenido (Oz)": round(contenido_flotacion_oz, 4)
        },
        "Producción Diaria (gr)": round(produccion_diaria_gr, 4),
        "Producción Diaria (Oz)": round(produccion_diaria_oz, 4),
        "Recuperación por Contenido (%)": round(recuperacion_por_contenido, 2),
        "Recuperación por Leyes (%)": round(recuperacion_por_leyes, 2)
    }
    
    return resultados

# ==========================================
# EJEMPLO DE USO (Simulación de ingreso de datos)
# ==========================================
datos_operacion = {
    "fecha": "2026-05-22",
    "turno": "Mañana",
    "tmh_tratadas": 150.0,          # Toneladas Métricas Húmedas
    "humedad_porcentaje": 8.5,      # % de Humedad
    "ley_cabeza_au": 4.2,           # gr/TMS
    
    # Circuitos de Concentración
    "espiral_ley_au": 45.0,         # gr/TMS
    "espiral_conc_tms_dia": 2.5,    # Concentrado Producido TMS
    
    "icon_ley_au": 120.0,           # gr/TMS
    "icon_conc_tms_dia": 1.1,       # Concentrado Producido TMS
    
    "flotacion_ley_au": 85.0,       # gr/TMS
    "flotacion_conc_tms_dia": 3.8,  # Concentrado Producido TMS
    
    # Salidas
    "ley_relave_au": 0.45           # Ley de relave gr/TMS
}

# Ejecutar el cálculo
reporte = calcular_balance_metalurgico(datos_operacion)

# Mostrar el reporte en pantalla
print(f"--- REPORTE METALÚRGICO: {reporte['Fecha']} ({reporte['Turno']}) ---")
print(f"Mineral Tratado (TMS): {reporte['TMS Tratadas']}")
print(f"Contenido en Cabeza: {reporte['Contenido Cabeza (gr)']} gr Au\n")
print(f"--> ESPIRAL  | Ratio: {reporte['Espiral']['Ratio']} | Contenido: {reporte['Espiral']['Contenido (Oz)']} Oz")
print(f"--> ICON 350 | Ratio: {reporte['ICON 350']['Ratio']} | Contenido: {reporte['ICON 350']['Contenido (Oz)']} Oz")
print(f"--> FLOTACIÓN| Ratio: {reporte['Flotación']['Ratio']} | Contenido: {reporte['Flotación']['Contenido (Oz)']} Oz\n")
print(f"Producción Diaria Total: {reporte['Producción Diaria (gr)']} gr ({reporte['Producción Diaria (Oz)']} Oz)")
print(f"Recuperación Diaria (Método Contenido): {reporte['Recuperación por Contenido (%)']}%")
print(f"Recuperación Diaria (Método Leyes): {reporte['Recuperación por Leyes (%)']}%")

# Cómo se manipula una consulta en python desde terminal:
# PS C:\Users\intel\Documents\oro> & C:\Users\intel\AppData\Local\
# Microsoft\WindowsApps\python3.13.exe c:/Users/intel/Documents/oro/calculos_en_python.py

# --- REPORTE METALÚRGICO: 2026-05-22 (Mañana) ---
# Mineral Tratado (TMS): 137.25
# Contenido en Cabeza: 576.45 gr Au

# --> ESPIRAL  | Ratio: 54.9 | Contenido: 3.617 Oz
#--> ICON 350 | Ratio: 124.77 | Contenido: 4.2439 Oz
#--> FLOTACIÓN| Ratio: 36.12 | Contenido: 10.3847 Oz

# Producción Diaria Total: 567.5 gr (18.2455 Oz)
# Recuperación Diaria (Método Contenido): 98.45%
# Recuperación Diaria (Método Leyes): 89.29%