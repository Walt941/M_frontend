
import React, { useState, useEffect, useRef } from "react"


export default function TypingPractice() {
  

  return (
    <div className="container max-w-3xl mx-auto py-10">
    <div className="bg-main-secondary shadow-xl border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl text-text-primary font-bold">Práctica de Mecanografía</h1>
        <p className="text-gray-600">
          Escribe las palabras que aparecen. Las letras correctas se mostrarán en verde y las incorrectas en rojo.
        </p>
      </div>
      <div>
       
          <div className="flex flex-col items-center justify-center py-10">
            <p className="mb-6 text-center text-text-primary">Haz clic en el botón para comenzar una nueva sesión de mecanografía.</p>
            <button
              
              className="bg-main-primary text-text-secondary px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Comenzar Sesión
            </button>
          </div>
      
      </div>
    </div>
  </div>
  )
}