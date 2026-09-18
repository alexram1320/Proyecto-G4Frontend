import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    RespuestaApi,
    RespuestaPaginadaApi
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApagonYaApiService {
    constructor(private readonly http: HttpClient) {}

}
