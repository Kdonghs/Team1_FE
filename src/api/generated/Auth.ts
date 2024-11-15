/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { AesDecodeData, AttendUrlCreateData, MemberCodeJoinData } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Auth<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags 인증기능 구현
   * @name MemberCodeJoin
   * @summary 인증 코드로 멤버 토큰 반환
   * @request GET:/api/auth/memberCode
   * @secure
   * @response `200` `MemberCodeJoinData` OK
   */
  memberCodeJoin = (
    query: {
      memberCode: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<MemberCodeJoinData, any>({
      path: `/api/auth/memberCode`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags 인증기능 구현
   * @name AesDecode
   * @summary 인증 코드 복호화(테스트용)
   * @request GET:/api/auth/memberCode/decode
   * @secure
   * @response `200` `AesDecodeData` OK
   */
  aesDecode = (
    query: {
      memberCode: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<AesDecodeData, any>({
      path: `/api/auth/memberCode/decode`,
      method: "GET",
      query: query,
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags 인증기능 구현
   * @name AttendUrlCreate
   * @summary 인증 코드 생성(테스트용)
   * @request GET:/api/auth/memberCode/create
   * @secure
   * @response `200` `AttendUrlCreateData` OK
   */
  attendUrlCreate = (params: RequestParams = {}) =>
    this.request<AttendUrlCreateData, any>({
      path: `/api/auth/memberCode/create`,
      method: "GET",
      secure: true,
      ...params,
    });
}
