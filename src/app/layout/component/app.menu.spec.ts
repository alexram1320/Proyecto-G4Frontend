import { AutenticacionService } from '../../core/services/autenticacion.service';
import { AppMenu } from './app.menu';

describe('AppMenu', () => {
    it('mantiene una referencia estable para evitar reconstrucciones continuas', () => {
        const autenticacion = {
            tieneRol: (...roles: string[]) => roles.includes('ADMIN')
        } as AutenticacionService;

        const componente = new AppMenu(autenticacion);
        const referenciaInicial = componente.model;

        expect(componente.model).toBe(referenciaInicial);
        expect(componente.model.map((grupo) => grupo.label)).toEqual(['Operación', 'Administración']);
    });

    it('no muestra las opciones administrativas a otros roles', () => {
        const autenticacion = {
            tieneRol: () => false
        } as unknown as AutenticacionService;

        const componente = new AppMenu(autenticacion);

        expect(componente.model.map((grupo) => grupo.label)).toEqual(['Operación']);
    });
});
